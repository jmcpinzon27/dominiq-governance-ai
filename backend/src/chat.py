import os
import requests
import uuid
from flask import jsonify
from db import get_db_conn

SAIA_API_KEY    = os.getenv("SAIA_API_KEY")
SAIA_BASE_URL   = "https://api.saia.ai"
MODEL_NAME      = "saia:assistant:[DominiQ]Maturity"
REVISION        = 1

def chat_with_agent(messages):
    url = f"{SAIA_BASE_URL}/chat/completions"
    headers = {
        "Authorization": f"Bearer {SAIA_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": MODEL_NAME,
        "revision": REVISION,
        "messages": messages,
    }
    resp = requests.post(url, headers=headers, json=payload)
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]

def chat_init(data):
    token = data.get("session_token")
    conn, cur = get_db_conn(), None
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT session_id, axis_id, user_id FROM sessions WHERE session_token=%s",
            (token,)
        )
        row = cur.fetchone()
        if not row:
            return jsonify(error="Invalid token"), 404
        session_id, axis_id, user_id = row

        # saludo
        cur.execute("SELECT user_name FROM users WHERE user_id=%s", (user_id,))
        user_name = cur.fetchone()[0]
        greeting = {"role":"assistant","content":f"Hola {user_name}, listo para empezar?"}

        # primera pregunta
        cur.execute("""
          SELECT maturity_question_id, question_text
            FROM maturity_questions
           WHERE axis_id=%s
           ORDER BY question_order
           LIMIT 1
        """, (axis_id,))
        qid, qtext = cur.fetchone()

        cur.execute("SELECT numeric_value, option_text FROM response_options ORDER BY numeric_value")
        options = [{"numeric_value":v,"option_text":t} for v,t in cur.fetchall()]

        question = {"role":"assistant","content":qtext}

        return jsonify(messages=[greeting, question], question_id=qid, options=options, is_last=False)
    finally:
        if cur: cur.close()
        conn.close()

def chat_message(data):
    token    = data["session_token"]
    prev_qid = int(data["question_id"])
    answer   = int(data["answer"])

    conn, cur = get_db_conn(), None
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT session_id, axis_id FROM sessions WHERE session_token=%s",
            (token,)
        )
        row = cur.fetchone()
        if not row:
            return jsonify(error="Invalid token"), 404
        session_id, axis_id = row

        # grabar respuesta
        cur.execute("""
            INSERT INTO maturity_answers(session_id,maturity_question_id,numeric_value,created_at,updated_at)
            VALUES(%s,%s,%s,NOW(),NOW())
        """, (session_id, prev_qid, answer))
        conn.commit()

        # siguiente pregunta
        cur.execute("""
          SELECT maturity_question_id, question_text
            FROM maturity_questions
           WHERE axis_id=%s
             AND question_order > (
                   SELECT question_order
                     FROM maturity_questions
                    WHERE maturity_question_id=%s
                 )
           ORDER BY question_order
           LIMIT 1
        """, (axis_id, prev_qid))
        nxt = cur.fetchone()
        if not nxt:
            return jsonify(end=True)

        nxt_qid, nxt_text = nxt
        cur.execute("SELECT numeric_value, option_text FROM response_options ORDER BY numeric_value")
        options = [{"numeric_value":v,"option_text":t} for v,t in cur.fetchall()]

        question = {"role":"assistant","content":nxt_text}
        return jsonify(messages=[question], question_id=nxt_qid, options=options, is_last=False)
    finally:
        if cur: cur.close()
        conn.close()
