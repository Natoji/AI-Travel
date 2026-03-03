try:
    from google import genai
    _USE_NEW_SDK = True
except ImportError:
    import google.generativeai as genai
    _USE_NEW_SDK = False
import json
import re
from config import settings

if _USE_NEW_SDK:
    client = genai.Client(api_key=settings.gemini_api_key)
else:
    genai.configure(api_key=settings.gemini_api_key)

def generate_itinerary(destination: str, days: int, budget: str,
                        travel_style: list, people: int,
                        departure_city: str = '') -> dict:
    style_text = ", ".join(travel_style)
    prompt = f"""
Ban la chuyen gia tu van du lich Viet Nam.
Hay len ke hoach du lich chi tiet voi thong tin sau:
- Xuat phat tu: {departure_city}
- Diem den: {destination}
- So ngay: {days} ngay
- Ngan sach: {budget} VND/nguoi
- Phong cach: {style_text}
- So nguoi: {people}

Luu y quan trong:
- Ngay dau tien can co lich di chuyen tu {departure_city} den {destination} (goi y phuong tien: may bay/xe khach/tau tuy khoang cach)
- Ngay cuoi can co lich di chuyen tu {destination} ve {departure_city}
- Tinh ca chi phi di chuyen 2 chieu vao budget_breakdown

Chi tra ve JSON theo dung format sau, KHONG them text nao khac, KHONG doi ten key:
{{
  "trip_summary": {{
    "destination": "...",
    "total_days": 0,
    "estimated_cost": "...",
    "best_time": "..."
  }},
  "days": [
    {{
      "day": 1,
      "title": "...",
      "schedule": [
        {{
          "time": "07:00",
          "period": "Sang",
          "place": "...",
          "address": "...",
          "description": "...",
          "estimated_cost": "...",
          "duration": "... tieng",
          "tips": "..."
        }}
      ]
    }}
  ],
  "accommodation": [
    {{
      "name": "...",
      "area": "...",
      "price_range": "...",
      "why": "..."
    }}
  ],
  "packing_list": ["..."],
  "budget_breakdown": {{
    "luu_tru": "...",
    "an_uong": "...",
    "di_chuyen": "...",
    "hoat_dong": "...",
    "mua_sam_phat_sinh": "..."
  }}
}}
"""
    if _USE_NEW_SDK:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        text = response.text.strip()
    else:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        text = (response.text or "").strip()
    text = re.sub(r'^```json\s*', '', text)
    text = re.sub(r'^```\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    return json.loads(text)
