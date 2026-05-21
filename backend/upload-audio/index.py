import os
import json
import base64
import hashlib
import hmac
import datetime
import urllib.request

def _sign(key, msg):
    return hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()

def _s3_put(key, data, content_type, access_key, secret_key):
    endpoint = 'bucket.poehali.dev'
    region = 'us-east-1'
    t = datetime.datetime.utcnow()
    amzdate = t.strftime('%Y%m%dT%H%M%SZ')
    datestamp = t.strftime('%Y%m%d')
    content_hash = hashlib.sha256(data).hexdigest()
    bucket = 'files'

    canonical_headers = (
        f'content-type:{content_type}\n'
        f'host:{endpoint}\n'
        f'x-amz-content-sha256:{content_hash}\n'
        f'x-amz-date:{amzdate}\n'
    )
    signed_headers = 'content-type;host;x-amz-content-sha256;x-amz-date'
    canonical_request = '\n'.join([
        'PUT', f'/{bucket}/{key}', '',
        canonical_headers, signed_headers, content_hash
    ])
    credential_scope = f'{datestamp}/{region}/s3/aws4_request'
    string_to_sign = '\n'.join([
        'AWS4-HMAC-SHA256', amzdate, credential_scope,
        hashlib.sha256(canonical_request.encode('utf-8')).hexdigest()
    ])
    k_date = _sign(('AWS4' + secret_key).encode('utf-8'), datestamp)
    k_region = _sign(k_date, region)
    k_service = _sign(k_region, 's3')
    signing_key = _sign(k_service, 'aws4_request')
    signature = hmac.new(signing_key, string_to_sign.encode('utf-8'), hashlib.sha256).hexdigest()
    auth = (
        f'AWS4-HMAC-SHA256 Credential={access_key}/{credential_scope}, '
        f'SignedHeaders={signed_headers}, Signature={signature}'
    )
    url = f'https://{endpoint}/{bucket}/{key}'
    req = urllib.request.Request(url, data=data, method='PUT')
    req.add_header('Content-Type', content_type)
    req.add_header('x-amz-date', amzdate)
    req.add_header('x-amz-content-sha256', content_hash)
    req.add_header('Authorization', auth)
    with urllib.request.urlopen(req) as resp:
        return resp.status


def handler(event: dict, context) -> dict:
    """Загружает аудиофайл (base64) в S3 и возвращает публичный CDN-URL."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': ''
        }

    body = json.loads(event.get('body') or '{}')
    file_data = body.get('file')
    filename = body.get('filename', 'music.mp3')

    if not file_data:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'No file provided'})
        }

    audio_bytes = base64.b64decode(file_data)
    access_key = os.environ['AWS_ACCESS_KEY_ID']
    secret_key = os.environ['AWS_SECRET_ACCESS_KEY']

    key = f'wedding-music/{filename}'
    _s3_put(key, audio_bytes, 'audio/mpeg', access_key, secret_key)

    cdn_url = f"https://cdn.poehali.dev/projects/{access_key}/bucket/{key}"
    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'url': cdn_url})
    }
