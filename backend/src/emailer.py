import os
import logging
from botocore.exceptions import ClientError
import boto3

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

USE_SES          = os.getenv("USE_SES","false").lower()=="true"
AWS_REGION       = os.getenv("AWS_REGION","eu-west-1")
SES_SOURCE_EMAIL = os.getenv("SES_SOURCE_EMAIL")

if USE_SES:
    ses = boto3.client("ses", region_name=AWS_REGION)

def send_mail(to_addr, subject, body):
    if USE_SES:
        try:
            resp = ses.send_email(
                Source=SES_SOURCE_EMAIL,
                Destination={"ToAddresses":[to_addr]},
                Message={
                    "Subject":{"Data":subject},
                    "Body":{"Text":{"Data":body}}
                }
            )
            logger.info(f"SES response: {resp}")
        except ClientError as e:
            logger.error(f"SES send_email failed: {e}")
    else:
        logger.info(f"[MAIL SIMULADO]\nTo: {to_addr}\nSubject: {subject}\n\n{body}")
