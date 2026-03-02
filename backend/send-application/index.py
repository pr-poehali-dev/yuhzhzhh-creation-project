import json
import os
import urllib.request
# v4
import urllib.parse


def handler(event: dict, context) -> dict:
    """Отправляет заявку на аренду квартиры в Telegram чат"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))

    districts = body.get('districts', [])
    property_type = body.get('propertyType', [])
    move_date = body.get('moveDate', '—')
    rental_period = body.get('rentalPeriod', '—')
    rental_period_other = body.get('rentalPeriodOther', '')
    residents = body.get('residents', '—')
    residents_other = body.get('residentsOther', '')
    has_children = body.get('hasChildren', '—')
    has_pets = body.get('hasPets', '—')
    budget = body.get('budget', '—')
    rooms = body.get('rooms', '—')
    wishes = body.get('wishes', '—') or '—'
    contact = body.get('contact', '—')
    contact_method = body.get('contactMethod', '—')
    contact_method_other = body.get('contactMethodOther', '')

    rental_display = rental_period_other if rental_period == 'other' else rental_period
    residents_display = residents_other if residents == 'other' else residents
    contact_method_display = contact_method_other if contact_method == 'other' else contact_method

    text = (
        "🏠 *Новая заявка на аренду — WSE*\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        f"📍 *Районы:* {', '.join(districts) if districts else '—'}\n"
        f"🏡 *Тип жилья:* {', '.join(property_type) if property_type else '—'}\n"
        f"📅 *Дата заезда:* {move_date}\n"
        f"⏳ *Срок аренды:* {rental_display}\n"
        f"👥 *Число жильцов:* {residents_display}\n"
        f"👶 *Дети:* {has_children}\n"
        f"🐾 *Питомцы:* {has_pets}\n"
        f"💰 *Бюджет:* {budget}\n"
        f"🚪 *Комнат:* {rooms}\n"
        f"💬 *Пожелания:* {wishes}\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        f"📞 *Контакт:* {contact}\n"
        f"✉️ *Способ связи:* {contact_method_display}\n"
    )

    token = os.environ['TELEGRAM_BOT_TOKEN']
    chat_id = os.environ['TELEGRAM_CHAT_ID']

    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = json.dumps({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': 'Markdown'
    }).encode('utf-8')

    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True, 'message_id': result.get('result', {}).get('message_id')})
    }