import os
import uuid
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from mangum import Mangum
from db import get_db_conn
from chat import chat_with_agent
from emailer import send_mail

load_dotenv()

# Si sirves aquí el build de React, ponlo en backend/static/
app = Flask(__name__, static_folder="static", static_url_path="/")
CORS(app, resources={r"/api/*": {"origins": "*"}})

FRONTEND_BASE_URL = os.getenv("VITE_FE_ROOT", "http://localhost:5173")

# Rutas para servir la SPA
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_spa(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

# ————— Catálogos —————

@app.route("/api/industries", methods=["GET"])
def get_industries():
    conn = get_db_conn(); cur = conn.cursor()
    cur.execute("SELECT industry_id, industry_name FROM industries ORDER BY industry_name")
    data = [{"industry_id": r[0], "industry_name": r[1]} for r in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(data)

@app.route("/api/roles", methods=["GET"])
def get_roles():
    conn = get_db_conn(); cur = conn.cursor()
    cur.execute("SELECT role_id, role_name FROM roles ORDER BY role_name")
    data = [{"role_id": r[0], "role_name": r[1]} for r in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(data)

@app.route("/api/axes", methods=["GET"])
def get_axes():
    conn = get_db_conn(); cur = conn.cursor()
    cur.execute("SELECT axis_id, axis_name FROM axis ORDER BY axis_name")
    data = [{"axis_id": r[0], "axis_name": r[1]} for r in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(data)

@app.route("/api/companies", methods=["GET"])
def get_companies():
    conn = get_db_conn(); cur = conn.cursor()
    cur.execute("SELECT company_id, company_name FROM companies ORDER BY company_name")
    data = [{"company_id": r[0], "company_name": r[1]} for r in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(data)

@app.route("/api/projects", methods=["GET"])
def get_projects():
    company_id = request.args.get("company_id", type=int)
    conn = get_db_conn(); cur = conn.cursor()
    cur.execute(
        "SELECT project_id, project_name "
        "FROM projects WHERE company_id=%s ORDER BY project_name",
        (company_id,)
    )
    data = [{"project_id": r[0], "project_name": r[1]} for r in cur.fetchall()]
    cur.close(); conn.close()
    return jsonify(data)

# ————— Creación de responsables + mails —————
@app.route("/api/submit-responsibles", methods=["POST"])
def submit_responsibles():
    payload      = request.get_json()
    cliente      = payload["cliente"]
    proyecto     = payload["proyecto"]
    industria_id = int(payload["industria"])
    responsables = payload["responsables"]

    conn = get_db_conn(); cur = conn.cursor()
    try:
        for r in responsables:
            # 1) Upsert company
            cur.execute("SELECT company_id FROM companies WHERE company_name=%s", (cliente,))
            row = cur.fetchone()
            if row:
                company_id = row[0]
            else:
                cur.execute(
                    "INSERT INTO companies(company_name, industry_id) "
                    "VALUES (%s,%s) RETURNING company_id",
                    (cliente, industria_id)
                )
                company_id = cur.fetchone()[0]

            # 2) Upsert project
            cur.execute(
                "SELECT project_id FROM projects "
                "WHERE project_name=%s AND company_id=%s",
                (proyecto, company_id)
            )
            row = cur.fetchone()
            if row:
                project_id = row[0]
            else:
                cur.execute(
                    "INSERT INTO projects(project_name, company_id) "
                    "VALUES (%s,%s) RETURNING project_id",
                    (proyecto, company_id)
                )
                project_id = cur.fetchone()[0]

            # 3) Upsert user
            name, email, role_id, axis_id = (
                r["name"], r["email"], int(r["role"]), int(r["eje"])
            )
            cur.execute("SELECT user_id FROM users WHERE email=%s", (email,))
            row = cur.fetchone()
            if row:
                user_id = row[0]
                cur.execute(
                    "UPDATE users SET user_name=%s, role_id=%s, company_id=%s "
                    "WHERE user_id=%s",
                    (name, role_id, company_id, user_id)
                )
            else:
                cur.execute(
                    "INSERT INTO users(user_name, email, role_id, company_id) "
                    "VALUES(%s,%s,%s,%s) RETURNING user_id",
                    (name, email, role_id, company_id)
                )
                user_id = cur.fetchone()[0]

            # 4) Create session & send invite mail
            session_token = str(uuid.uuid4())
            cur.execute(
                "INSERT INTO sessions(user_id, project_id, axis_id, "
                "session_token, session_start, is_active) "
                "VALUES (%s,%s,%s,%s,NOW(),TRUE)",
                (user_id, project_id, axis_id, session_token)
            )
            conn.commit()

            cur.execute("SELECT axis_name FROM axis WHERE axis_id=%s", (axis_id,))
            axis_name = cur.fetchone()[0]
            link = f"{FRONTEND_BASE_URL}/modelo-madurez/{session_token}"
            body = f"Hola, eres responsable del eje *{axis_name}*.\nEntra aquí: {link}"
            send_mail(email, "Invitación a encuesta de madurez", body)

        return jsonify(status="ok"), 200

    except Exception:
        conn.rollback()
        raise

    finally:
        cur.close(); conn.close()

# ————— Chat endpoints —————

@app.route("/api/chat/init", methods=["POST"])
def chat_init():
    data = request.get_json()
    token = data.get("session_token")
    # aquí llamarías a chat_with_agent o usarías tu lógica de BD
    # ejemplo mínimo:
    greeting = chat_with_agent([{"role":"system","content":"start"}])
    return jsonify(messages=[{"role":"assistant","content":greeting}])

@app.route("/api/chat/message", methods=["POST"])
def chat_message():
    data = request.get_json()
    # guarda respuesta, llama a chat_with_agent, etc.
    reply = chat_with_agent([{"role":"user","content": data.get("text","")}])
    return jsonify(messages=[{"role":"assistant","content":reply}])

# ————— Lambda handler —————
handler = Mangum(app, lifespan="off")
