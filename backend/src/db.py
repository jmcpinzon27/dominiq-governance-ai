import os
import pg8000

def get_db_conn():
    """
    Devuelve una conexión pg8000 y fija el search_path al esquema app_dominiq.
    """
    conn = pg8000.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 5432)),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        ssl_context=None
    )
    cur = conn.cursor()
    # Opcional: si tu esquema principal es app_dominiq
    cur.execute("SET search_path TO app_dominiq, public")
    return conn