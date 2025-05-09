# backend/src/app.py

import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv

from db import get_db_conn
from chat import chat_init, chat_message
from emailer import send_mail

load_dotenv()

# Sirve el build estático de React (lo pondrás en backend/static)
app = Flask(__name__, static_folder="static", static_url_path="/")
CORS(app, resources={r"/api/*": {"origins": "*"}})

FRONTEND_BASE_URL = os.getenv("VITE_FE_ROOT", "http://localhost:5173")

# — SPA —  
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


# — Catálogos —  
@app.route("/api/industries", methods=["GET"])
def api_industries():
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT industry_id, industry_name FROM industries ORDER BY industry_name")
    data = [{"id": r[0], "name": r[1]} for r in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(data)


@app.route("/api/roles", methods=["GET"])
def api_roles():
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT role_id, role_name FROM roles ORDER BY role_name")
    data = [{"id": r[0], "name": r[1]} for r in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(data)


@app.route("/api/axes", methods=["GET"])
def api_axes():
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT axis_id, axis_name FROM axis ORDER BY axis_name")
    data = [{"id": r[0], "name": r[1]} for r in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(data)


@app.route("/api/companies", methods=["GET"])
def api_companies():
    industry_id = request.args.get("industry_id", type=int)
    conn = get_db_conn()
    cur = conn.cursor()
    if industry_id:
        cur.execute(
            "SELECT company_id, company_name FROM companies WHERE industry_id=%s ORDER BY company_name",
            (industry_id,)
        )
    else:
        cur.execute("SELECT company_id, company_name FROM companies ORDER BY company_name")
    data = [{"id": r[0], "name": r[1]} for r in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(data)


@app.route("/api/projects", methods=["GET"])
def api_projects():
    company_id = request.args.get("company_id", type=int)
    if not company_id:
        return jsonify([])
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute(
        "SELECT project_id, project_name FROM projects WHERE company_id=%s ORDER BY project_name",
        (company_id,)
    )
    data = [{"id": r[0], "name": r[1]} for r in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(data)


# — Envío de invitaciones —  
@app.route("/api/submit-responsibles", methods=["POST"])
def api_submit():
    payload      = request.get_json()
    cliente      = payload["cliente"]
    proyecto     = payload["proyecto"]
    industria_id = int(payload["industria"])
    responsables = payload["responsables"]

    conn = get_db_conn()
    cur = conn.cursor()
    try:
        for r in responsables:
            # 1) upsert company
            cur.execute("SELECT company_id FROM companies WHERE company_name=%s", (cliente,))
            row = cur.fetchone()
            if row:
                company_id = row[0]
            else:
                cur.execute(
                    "INSERT INTO companies(company_name, industry_id) VALUES(%s,%s) RETURNING company_id",
                    (cliente, industria_id)
                )
                company_id = cur.fetchone()[0]

            # 2) upsert project
            cur.execute(
                "SELECT project_id FROM projects WHERE project_name=%s AND company_id=%s",
                (proyecto, company_id)
            )
            row = cur.fetchone()
            if row:
                project_id = row[0]
            else:
                cur.execute(
                    "INSERT INTO projects(project_name, company_id) VALUES(%s,%s) RETURNING project_id",
                    (proyecto, company_id)
                )
                project_id = cur.fetchone()[0]

            # 3) upsert user
            name, email, role_id, axis_id = (
                r["name"], r["email"], int(r["role"]), int(r["eje"])
            )
            cur.execute("SELECT user_id FROM users WHERE email=%s", (email,))
            row = cur.fetchone()
            if row:
                user_id = row[0]
                cur.execute(
                    "UPDATE        users SET user_name=%s, role_id=%s, company_id=%s WHERE user_id=%s",
                    (name, role_id, company_id, user_id)
                )
            else:
                cur.execute(
                    "INSERT INTO users(user_name,email,role_id,company_id) VALUES(%s,%s,%s,%s) RETURNING user_id",
                    (name, email, role_id, company_id)
                )
                user_id = cur.fetchone()[0]

            # 4) crear sesión y enviar mail
            session_token = str(uuid.uuid4())
            cur.execute("""
                INSERT INTO sessions(user_id,project_id,axis_id,session_token,session_start,is_active)
                VALUES (%s,%s,%s,%s,NOW(),TRUE)
            """, (user_id, project_id, axis_id, session_token))
            conn.commit()

            cur.execute("SELECT axis_name FROM axis WHERE axis_id=%s", (axis_id,))
            axis_name = cur.fetchone()[0]
            link = f"{FRONTEND_BASE_URL}/modelo-madurez/{session_token}"
            send_mail(email, axis_name, link)

        return jsonify(status="ok"), 200

    except:
        conn.rollback()
        raise
    finally:
        cur.close(); conn.close()


# — Chat con SAIA —  
@app.route("/api/chat/init", methods=["POST"])
def api_chat_init():
    return chat_init(request.get_json())


@app.route("/api/chat/message", methods=["POST"])
def api_chat_msg():
    return chat_message(request.get_json())


# — Mangum handler (Lambda) —  
from mangum import Mangum
handler = Mangum(app, lifespan="off")


if __name__ == "__main__":
    # Levanta Flask en host 0.0.0.0 puerto 5000, modo debug
    app.run(host="0.0.0.0", port=5000, debug=True)
