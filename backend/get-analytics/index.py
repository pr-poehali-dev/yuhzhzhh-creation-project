import json
import os
import psycopg2
import psycopg2.extras
# v2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}


def parse_device(ua: str):
    ua_lower = ua.lower()
    if 'mobile' in ua_lower or 'android' in ua_lower or 'iphone' in ua_lower:
        device = 'mobile'
    elif 'tablet' in ua_lower or 'ipad' in ua_lower:
        device = 'tablet'
    else:
        device = 'desktop'

    if 'windows' in ua_lower:
        os_name = 'Windows'
    elif 'android' in ua_lower:
        os_name = 'Android'
    elif 'iphone' in ua_lower or 'ipad' in ua_lower:
        os_name = 'iOS'
    elif 'mac' in ua_lower:
        os_name = 'macOS'
    elif 'linux' in ua_lower:
        os_name = 'Linux'
    else:
        os_name = 'Unknown'

    if 'chrome' in ua_lower and 'edg' not in ua_lower and 'opr' not in ua_lower:
        browser = 'Chrome'
    elif 'firefox' in ua_lower:
        browser = 'Firefox'
    elif 'safari' in ua_lower and 'chrome' not in ua_lower:
        browser = 'Safari'
    elif 'edg' in ua_lower:
        browser = 'Edge'
    elif 'opr' in ua_lower or 'opera' in ua_lower:
        browser = 'Opera'
    else:
        browser = 'Unknown'

    return device, os_name, browser


def handler(event: dict, context) -> dict:
    """Трекинг посещений и получение аналитики. POST — записывает визит, GET — возвращает статистику."""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': {**CORS_HEADERS, 'Access-Control-Max-Age': '86400'}, 'body': ''}

    method = event.get('httpMethod', 'GET')
    conn = psycopg2.connect(os.environ['DATABASE_URL'])

    if method == 'POST':
        headers = event.get('headers', {}) or {}
        body = json.loads(event.get('body') or '{}')

        ip = (
            headers.get('x-forwarded-for', '').split(',')[0].strip()
            or headers.get('x-real-ip', '')
        )
        user_agent = headers.get('user-agent', '')
        referrer = body.get('referrer', '')
        device, os_name, browser = parse_device(user_agent)

        cur = conn.cursor()
        cur.execute(
            "INSERT INTO visits (ip, device, os, browser, referrer, user_agent) VALUES (%s, %s, %s, %s, %s, %s)",
            (ip, device, os_name, browser, referrer, user_agent)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': json.dumps({'ok': True})}

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute("SELECT COUNT(*) as total FROM visits")
    total = cur.fetchone()['total']

    cur.execute("SELECT COUNT(DISTINCT ip) as unique_count FROM visits")
    unique = cur.fetchone()['unique_count']

    cur.execute("SELECT device, COUNT(*) as count FROM visits GROUP BY device ORDER BY count DESC")
    devices = [dict(r) for r in cur.fetchall()]

    cur.execute("SELECT os, COUNT(*) as count FROM visits GROUP BY os ORDER BY count DESC")
    os_stats = [dict(r) for r in cur.fetchall()]

    cur.execute("SELECT browser, COUNT(*) as count FROM visits GROUP BY browser ORDER BY count DESC")
    browsers = [dict(r) for r in cur.fetchall()]

    cur.execute("""
        SELECT id, visited_at::text as visited_at, ip, device, os, browser, referrer
        FROM visits ORDER BY visited_at DESC LIMIT 100
    """)
    visits = [dict(r) for r in cur.fetchall()]

    cur.close()
    conn.close()

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps({
            'total': total,
            'unique': unique,
            'devices': devices,
            'os_stats': os_stats,
            'browsers': browsers,
            'visits': visits
        })
    }