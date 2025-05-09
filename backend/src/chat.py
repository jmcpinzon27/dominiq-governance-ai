import os
import requests

SAIA_API_URL = os.getenv("SAIA_API_URL")
SAIA_API_KEY = os.getenv("SAIA_API_KEY")

def ini_prompt(jsonstring: str):
    """
    Llama al endpoint PUT de Saia para inicializar o guardar el prompt.
    """
    headers = {
        "Authorization": f"Bearer {SAIA_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "action": "save",
        "revisionId": 1,
        "prompt": jsonstring,
        "llmSettings": {
            "modelName": "gpt-4o-mini",
            "temperature": 0.0
        }
    }
    response = requests.put(SAIA_API_URL, headers=headers, json=payload)
    response.raise_for_status()
    return response

def chat_with_agent(messages: list[dict]) -> str:
    """
    Envía un array de mensajes a SAIA y devuelve el contenido de la respuesta.
    """
    resp = ini_prompt({"messages": messages})
    data = resp.json()
    return data["choices"][0]["message"]["content"]