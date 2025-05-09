import os
import pg8000

def get_db_conn():
    """
    Devuelve una conexión a Postgres usando pg8000 y las variables de entorno.
    """
    return pg8000.connect(
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT", 5432)),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS"),
        ssl_context=None
    )
