import os
import logging

logger = logging.getLogger(__name__)

USE_SES = os.getenv("USE_SES", "false").lower() == "true"
AWS_REGION = os.getenv("AWS_REGION")
SES_SOURCE_EMAIL = os.getenv("SES_SOURCE_EMAIL")

if USE_SES:
    import boto3
    ses = boto3.client("ses", region_name=AWS_REGION)

def send_mail(to_addr: str, subject: str, body: str):
    """
    Envía un correo usando AWS SES si USE_SES=true, o lo simula por log.
    """
    if USE_SES:
        try:
            resp = ses.send_email(
                Source=SES_SOURCE_EMAIL,
                Destination={"ToAddresses": [to_addr]},
                Message={
                    "Subject": {"Data": subject},
                    "Body":    {"Text": {"Data": body}}
                }
            )
            logger.info(f"SES send_email response: {resp}")
        except Exception:
            logger.error("Error sending SES email", exc_info=True)
    else:
        logger.info(f"[MAIL SIMULATED] To:{to_addr}\nSubject:{subject}\n\n{body}")