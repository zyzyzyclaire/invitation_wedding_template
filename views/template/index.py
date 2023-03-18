import requests
from config import client_id, client_secret

def geocoding(addr):
    url = "https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query="+addr
    headers = {'X-NCP-APIGW-API-KEY-ID': client_id,
                'X-NCP-APIGW-API-KEY': client_secret
                }

    r = requests.get(url, headers=headers)

    if r.status_code == 200:
        data = r.json()
        lat = data['addresses'][0]['y']  # 위도
        lng = data['addresses'][0]['x']  # 경도
        return [lat, lng]
    