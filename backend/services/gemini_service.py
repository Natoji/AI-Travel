"""
gemini_service.py — AI Agent với Function Calling

Tools:
  - get_weather_forecast : OpenWeatherMap
  - get_top_places       : Goong Maps Places API (thay Foursquare)
  - get_exchange_rate    : exchangerate-api.com
"""

import json
import re
import requests
from config import settings
from services.route_optimizer import optimize_itinerary_routes

try:
    from google import genai
    from google.genai import types as genai_types
    _USE_NEW_SDK = True
except ImportError:
    import google.generativeai as genai
    _USE_NEW_SDK = False

if _USE_NEW_SDK:
    client = genai.Client(api_key=settings.gemini_api_key)
else:
    genai.configure(api_key=settings.gemini_api_key)

OPENWEATHER_KEY  = getattr(settings, "openweather_api_key",  "")
GOONG_KEY        = getattr(settings, "goong_api_key",        "")
DEFAULT_TIMEOUT  = 5
GOONG_TIMEOUT    = 6

HTTP = requests.Session()


def _http_get(url: str, *, params=None, headers=None, timeout: int = DEFAULT_TIMEOUT):
    return HTTP.get(url, params=params, headers=headers, timeout=timeout)


def _json_response(payload: dict, ensure_ascii: bool = True) -> str:
    return json.dumps(payload, ensure_ascii=ensure_ascii)


# ══════════════════════════════════════════════════════════════════════════════
# TOOLS
# ══════════════════════════════════════════════════════════════════════════════

def _get_weather_forecast(city: str, days: int) -> dict:
    if not OPENWEATHER_KEY:
        return {
            "city": city,
            "forecast": [
                {"day": i + 1, "condition": "Nắng nhẹ", "temp_high": 32,
                 "temp_low": 24, "humidity": 70}
                for i in range(min(days, 7))
            ],
            "source": "mock_data"
        }
    try:
        resp = _http_get(
            "https://api.openweathermap.org/data/2.5/forecast",
            params={"q": city, "appid": OPENWEATHER_KEY, "units": "metric",
                    "cnt": min(days * 8, 40), "lang": "vi"},
            timeout=DEFAULT_TIMEOUT
        )
        resp.raise_for_status()
        data = resp.json()
        daily: dict = {}
        for item in data.get("list", []):
            date = item["dt_txt"][:10]
            if date not in daily:
                daily[date] = {"temps": [], "descs": []}
            daily[date]["temps"].append(item["main"]["temp"])
            daily[date]["descs"].append(item["weather"][0]["description"])
        forecast = []
        for i, (date, info) in enumerate(list(daily.items())[:days]):
            mid = len(info["descs"]) // 2
            forecast.append({
                "day": i + 1, "date": date,
                "condition": info["descs"][mid],
                "temp_high": round(max(info["temps"])),
                "temp_low":  round(min(info["temps"])),
            })
        return {"city": city, "forecast": forecast, "source": "openweathermap"}
    except Exception as e:
        return {"city": city, "error": str(e), "forecast": [], "source": "error"}


def _geocode_city(city: str) -> tuple:
    """Lấy tọa độ trung tâm thành phố/địa điểm qua Nominatim (OpenStreetMap, miễn phí)."""
    try:
        resp = _http_get(
            "https://nominatim.openstreetmap.org/search",
            params={"q": city + ", Vietnam", "format": "json", "limit": 1},
            headers={"User-Agent": "AI-Travel-Planner/1.0"},
            timeout=DEFAULT_TIMEOUT
        )
        data = resp.json()
        if data:
            return float(data[0]["lat"]), float(data[0]["lon"])
    except Exception:
        pass
    # Fallback: Hà Nội
    return 21.0285, 105.8542


def _get_top_places(city: str, category: str, limit: int = 5) -> dict:
    """
    Tìm địa điểm qua Goong Maps Text Search.
    Trả về name, address, rating, lat, lng để hiển thị trên bản đồ.
    Khi chưa có Goong key: geocode tọa độ thực của city qua Nominatim.
    """
    QUERIES = {
        "restaurant": f"nhà hàng ngon {city}",
        "attraction": f"điểm tham quan nổi tiếng {city}",
        "hotel":      f"khách sạn {city}",
        "cafe":       f"quán cafe {city}",
        "shopping":   f"trung tâm mua sắm {city}",
    }
    query = QUERIES.get(category, f"{category} {city}")

    if not GOONG_KEY:
        # Geocode tọa độ thực của city, rải địa điểm mock xung quanh đó
        base_lat, base_lng = _geocode_city(city)

        # Tạo đủ offset cho số lượng limit được yêu cầu
        import random, math
        random.seed(hash(city + category) % 9999)
        offsets = []
        for i in range(max(limit, 20)):
            angle = (i * 137.5) % 360   # golden angle để phân bổ đều
            radius = 0.002 + (i % 5) * 0.0015
            lat_off = radius * math.cos(math.radians(angle))
            lng_off = radius * math.sin(math.radians(angle))
            offsets.append((round(lat_off, 6), round(lng_off, 6)))

        cat_label = {
            "restaurant": "Nhà hàng", "attraction": "Điểm tham quan",
            "hotel": "Khách sạn",     "cafe": "Quán cafe",
            "shopping": "Khu mua sắm",
        }.get(category, "Địa điểm")

        places = [
            {
                "name":    f"{cat_label} {city} số {i+1}",
                "address": f"{city}",
                "rating":  round(3.8 + (i % 12) * 0.1, 1),
                "lat":     round(base_lat + offsets[i][0], 6),
                "lng":     round(base_lng + offsets[i][1], 6),
            }
            for i in range(limit)
        ]
        return {"city": city, "category": category, "places": places, "source": "nominatim_mock"}

    try:
        resp = _http_get(
            "https://rsapi.goong.io/Place/textsearch",
            params={"input": query, "api_key": GOONG_KEY},
            timeout=GOONG_TIMEOUT
        )
        resp.raise_for_status()
        data = resp.json()
        places = []
        for r in (data.get("results") or [])[:limit]:
            loc = r.get("geometry", {}).get("location", {})
            places.append({
                "name":     r.get("name", ""),
                "address":  r.get("formatted_address", ""),
                "rating":   r.get("rating"),
                "lat":      loc.get("lat"),
                "lng":      loc.get("lng"),
                "place_id": r.get("place_id", ""),
            })
        return {"city": city, "category": category, "places": places, "source": "goong"}
    except Exception as e:
        return {"city": city, "category": category, "error": str(e),
                "places": [], "source": "error"}


def _estimate_price_range_from_budget(budget: str) -> str:
    try:
        b = int(str(budget).replace(",", "").strip())
    except Exception:
        b = 0
    if b <= 2000000:
        return "400k-900k/đêm"
    if b <= 4500000:
        return "800k-1.8tr/đêm"
    return "1.5-4tr/đêm"


def _augment_accommodation_suggestions(itinerary: dict, destination: str, budget: str) -> dict:
    acc = itinerary.get("accommodation")
    if not isinstance(acc, list):
        acc = []
    existing_names = {str((h or {}).get("name", "")).strip().lower() for h in acc}

    target_count = 5
    need = max(0, target_count - len(acc))
    if need == 0:
        itinerary["accommodation"] = acc
        return itinerary

    hotel_candidates = _get_top_places(destination, "hotel", max(need + 2, 6))
    places = (hotel_candidates or {}).get("places") or []
    added = 0
    for p in places:
        name = str(p.get("name", "")).strip()
        if not name:
            continue
        key = name.lower()
        if key in existing_names:
            continue
        acc.append({
            "name": name,
            "area": p.get("address") or destination,
            "price_range": _estimate_price_range_from_budget(budget),
            "why": "Vị trí thuận tiện, đánh giá tốt từ dữ liệu địa điểm.",
            "lat": p.get("lat"),
            "lng": p.get("lng"),
        })
        existing_names.add(key)
        added += 1
        if added >= need:
            break

    itinerary["accommodation"] = acc
    return itinerary


def _get_exchange_rate(from_currency: str, to_currency: str) -> dict:
    """Lấy tỷ giá qua fawazahmed0/currency-api — miễn phí, không cần key."""
    try:
        from_lower = from_currency.lower()
        to_lower   = to_currency.lower()
        # Thử CDN chính
        url = f"https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{from_lower}.json"
        resp = _http_get(url, timeout=DEFAULT_TIMEOUT)
        resp.raise_for_status()
        data = resp.json()
        rate = data.get(from_lower, {}).get(to_lower)
        if rate:
            return {"from": from_currency.upper(), "to": to_currency.upper(),
                    "rate": rate, "source": "fawazahmed0"}
        return {"from": from_currency.upper(), "to": to_currency.upper(),
                "error": "Không tìm thấy cặp tiền tệ", "source": "fawazahmed0"}
    except Exception:
        # Fallback CDN dự phòng
        try:
            url2 = f"https://latest.currency-api.pages.dev/v1/currencies/{from_lower}.json"
            resp2 = _http_get(url2, timeout=DEFAULT_TIMEOUT)
            resp2.raise_for_status()
            data2 = resp2.json()
            rate2 = data2.get(from_lower, {}).get(to_lower)
            if rate2:
                return {"from": from_currency.upper(), "to": to_currency.upper(),
                        "rate": rate2, "source": "fawazahmed0-fallback"}
        except Exception:
            pass
        # Mock data nếu cả 2 CDN đều lỗi
        mock_rates = {
            ("USD", "VND"): 25400, ("EUR", "VND"): 27500,
            ("JPY", "VND"): 170,   ("KRW", "VND"): 19,
            ("CNY", "VND"): 3500,  ("THB", "VND"): 710,
        }
        rate_mock = mock_rates.get((from_currency.upper(), to_currency.upper()), 1)
        return {"from": from_currency.upper(), "to": to_currency.upper(),
                "rate": rate_mock, "source": "mock_data"}


TOOL_MAP = {
    "get_weather_forecast": _get_weather_forecast,
    "get_top_places":       _get_top_places,
    "get_exchange_rate":    _get_exchange_rate,
}

def _execute_tool(name: str, args: dict) -> str:
    fn = TOOL_MAP.get(name)
    if not fn:
        return _json_response({"error": f"Unknown tool: {name}"})
    try:
        return _json_response(fn(**args), ensure_ascii=False)
    except Exception as e:
        return _json_response({"error": str(e)})


# ══════════════════════════════════════════════════════════════════════════════
# TOOL DECLARATIONS (schema cho Gemini)
# ══════════════════════════════════════════════════════════════════════════════

TOOL_DECLARATIONS = [
    {
        "name": "get_weather_forecast",
        "description": "Lấy dự báo thời tiết cho một thành phố trong N ngày.",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string", "description": "Tên thành phố, ví dụ: 'Da Nang'"},
                "days": {"type": "integer", "description": "Số ngày dự báo (tối đa 7)"},
            },
            "required": ["city", "days"],
        },
    },
    {
        "name": "get_top_places",
        "description": (
            "Tìm địa điểm nổi bật qua Goong Maps. "
            "Trả về tên, địa chỉ, rating và tọa độ lat/lng để hiển thị bản đồ."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "city":     {"type": "string"},
                "category": {"type": "string",
                             "enum": ["restaurant", "attraction", "hotel", "cafe", "shopping"]},
                "limit":    {"type": "integer"},
            },
            "required": ["city", "category"],
        },
    },
    {
        "name": "get_exchange_rate",
        "description": "Lấy tỷ giá hối đoái. Dùng khi điểm đến dùng ngoại tệ.",
        "parameters": {
            "type": "object",
            "properties": {
                "from_currency": {"type": "string"},
                "to_currency":   {"type": "string"},
            },
            "required": ["from_currency", "to_currency"],
        },
    },
]


# ══════════════════════════════════════════════════════════════════════════════
# MAIN
# ══════════════════════════════════════════════════════════════════════════════

def generate_itinerary(destination: str, days: int, budget: str,
                       travel_style: list, people: int,
                       departure_city: str = "",
                       planner_context: str = "") -> dict:
    system_prompt = """Bạn là AI Travel Agent chuyên nghiệp.
PHẢI dùng tools trước khi tạo lịch trình:
  - get_weather_forecast: thời tiết thực tế tại điểm đến
  - get_top_places: địa điểm thực từ Goong Maps (có tọa độ lat/lng)
  - get_exchange_rate: nếu điểm đến dùng ngoại tệ

Mỗi schedule item PHẢI có lat/lng lấy từ kết quả get_top_places.
QUAN TRỌNG: Mỗi ngày phải có địa điểm KHÁC NHAU, không được lặp lại địa điểm giữa các ngày.
MỖI NGÀY PHẢI CÓ 6-7 HOẠT ĐỘNG trong schedule, bao gồm:
  - Sáng: 2 hoạt động (ăn sáng + 1 địa điểm tham quan)
  - Sáng muộn: 1 hoạt động (tham quan #2)
  - Trưa: 1 hoạt động (ăn trưa)
  - Chiều: 2 hoạt động (2 địa điểm tham quan khác nhau)
  - Tối: 1 hoạt động (ăn tối + tự do khám phá)
Mỗi hoạt động phải có mô tả cụ thể, tips hữu ích và chi phí ước tính rõ ràng.

YÊU CẦU VỀ FIELD "tips" — RẤT QUAN TRỌNG:
Với mỗi địa điểm, "tips" phải là các lưu ý THỰC TẾ và CÓ THỂ HÀNH ĐỘNG NGAY:
  - Thời điểm tốt nhất để đến (giờ nào, tránh ngày nào)
  - Cần chuẩn bị gì (đặt vé trước, mang tiền mặt, dress code...)
  - Mẹo tiết kiệm hoặc trải nghiệm tốt hơn (combo vé, đường tắt, món phải thử...)
  - Cảnh báo thực tế (đông vào cuối tuần, đóng cửa thứ 2, giá chặt khách...)
TUYỆT ĐỐI KHÔNG viết tips chung chung như "địa điểm đẹp nên ghé thăm" hay "trải nghiệm thú vị"
"""
    # Tính số địa điểm cần thiết: mỗi ngày ~3-4 điểm tham quan, ~2-3 nhà hàng
    places_needed = max(10, days * 4)

    context_block = ""
    if planner_context and planner_context.strip():
        context_block = f"""
ADDITIONAL MEMORY + KNOWLEDGE CONTEXT:
{planner_context.strip()}

Apply this context as soft constraints:
- Reuse user preferences when possible.
- If memory conflicts with live tool data, prioritize live tool data.
"""

    user_prompt = f"""Lên kế hoạch du lịch:
- Xuất phát: {departure_city or 'Hà Nội'}
- Điểm đến: {destination}
- Số ngày: {days}
- Ngân sách: {budget} VND/người
- Phong cách: {', '.join(travel_style)}
- Số người: {people}
{context_block}

Thực hiện theo thứ tự:
1. get_weather_forecast({destination}, {min(days,7)})
2. get_top_places({destination}, attraction, {places_needed}) — lấy NHIỀU để phân bổ đều cho {days} ngày
3. get_top_places({destination}, restaurant, {places_needed})
4. get_top_places({destination}, hotel, 3)
5. Nếu nước ngoài: get_exchange_rate
6. Tạo JSON theo format sau (CHỈ trả JSON, không text khác):

YÊU CẦU QUAN TRỌNG khi tạo lịch trình:
- Mỗi ngày phải dùng các địa điểm KHÁC NHAU từ danh sách tool trả về
- Phân bổ đều: ngày 1 dùng địa điểm 1-3, ngày 2 dùng địa điểm 4-6, ngày 3 dùng 7-9...
- Nhà hàng mỗi bữa phải khác nhau giữa các ngày
- Nếu hết địa điểm từ tool thì tự sáng tạo thêm địa điểm phù hợp với {destination}

YÊU CẦU NGÀY ĐI VÀ NGÀY VỀ:
- Ngày 1 (ngày đầu): Hoạt động ĐẦU TIÊN phải là di chuyển từ "{departure_city or 'Hà Nội'}" đến "{destination}" (ghi rõ bến xe/sân bay/ga tàu tại {departure_city or 'Hà Nội'})
- Ngày {days} (ngày cuối): Hoạt động CUỐI CÙNG phải là di chuyển từ "{destination}" về "{departure_city or 'Hà Nội'}" (ghi rõ bến xe/sân bay/ga tàu tại {destination})

YÊU CẦU VỀ PHƯƠNG TIỆN DI CHUYỂN GIỮA CÁC ĐỊA ĐIỂM:
Với mỗi địa điểm trong schedule, thêm field "transport_to_next" gợi ý phương tiện tối ưu đến địa điểm tiếp theo dựa trên khoảng cách ước tính:
- Dưới 1km: "🚶 Đi bộ ~X phút"
- 1-5km: "🛵 Xe máy ~X phút" hoặc "🚌 Xe buýt ~X phút"
- 5-15km: "🚌 Xe buýt ~X phút" hoặc "🛵 Xe máy ~X phút" (nếu không có xe buýt thì "🚗 Taxi/GrabCar ~X phút")
- 15-100km: "🚌 Xe khách ~X tiếng" (nếu không có tuyến thì "🚗 Taxi/GrabCar ~X phút")
- 100-300km: "🚌 Xe khách ~X tiếng" hoặc "🚂 Tàu hỏa ~X tiếng" (ưu tiên xe khách/tàu vì tiết kiệm hơn)
- Trên 300km hoặc ra đảo: "✈️ Máy bay ~X tiếng" (ghi rõ sân bay xuất phát và đến)
Ưu tiên phương tiện công cộng và tiết kiệm phù hợp với ngân sách, chỉ gợi ý Taxi/GrabCar khi không có lựa chọn rẻ hơn hoặc khoảng cách ngắn trong nội thành
Địa điểm cuối cùng trong ngày thì để "transport_to_next": ""
QUAN TRỌNG: Nếu hoạt động đó BẢN THÂN ĐÃ LÀ di chuyển liên tỉnh (xe khách, tàu, máy bay) thì để "transport_to_next": "" — không gợi ý thêm phương tiện nữa

YÊU CẦU VỀ TRƯỜNG "address" — RẤT QUAN TRỌNG:
Điền address theo dạng người dùng có thể copy paste lên Google Maps để tìm ngay:
- Địa điểm cụ thể: "Hồ Núi Cốc, xã Tức Tranh, Thái Nguyên"
- Nhà hàng/quán ăn: "Quán cơm lam gà đồi, đường Bắc Kạn, TP. Thái Nguyên"
- Di chuyển liên tỉnh bằng xe/tàu: chỉ ghi địa chỉ điểm XUẤT PHÁT, ví dụ "Bến xe Thái Nguyên, đường Hoàng Văn Thụ, TP. Thái Nguyên"
- Di chuyển bằng máy bay: chỉ ghi tên sân bay xuất phát, ví dụ "Sân bay Nội Bài, Phù Lỗ, Sóc Sơn, Hà Nội"
- Khu vực chung: "Khu phố ẩm thực Đồng Quang, TP. Thái Nguyên"
KHÔNG ghi chung chung như "Thái Nguyên" hay "địa phương"
KHÔNG gộp 2 địa điểm vào 1 dòng address (không ghi "A đi B")

{{
  "trip_summary": {{
    "destination": "...", "total_days": {days},
    "estimated_cost": "...", "best_time": "...",
    "weather_note": "..."
  }},
  "days": [
    {{
      "day": 1, "title": "...", "weather": "...",
      "schedule": [
        {{
          "time": "07:00", "period": "Sang",
          "place": "...", "address": "...",
          "lat": 0.0, "lng": 0.0,
          "description": "...", "estimated_cost": "...",
          "duration": "... tiếng", "tips": "...",
          "tips": "Viết 2-3 lưu ý THỰC TẾ và CỤ THỂ cho địa điểm này: người dùng nên làm gì, cần chuẩn bị gì, tránh điều gì, mẹo tiết kiệm hoặc trải nghiệm tốt hơn. Ví dụ: 'Đến trước 8h để tránh đông; mua vé online giảm 20%; mang theo tiền mặt vì không nhận thẻ'. KHÔNG viết chung chung kiểu 'địa điểm đẹp nên ghé'.",
          "highlights": ["Điểm nổi bật cụ thể 1 — mô tả ngắn tại sao đáng xem/làm", "Điểm nổi bật 2", "Điểm nổi bật 3"],
          "best_for": "Phù hợp cho ai: cặp đôi / gia đình có trẻ em / người đi solo / yêu lịch sử / yêu ẩm thực...",
          "nearby": "Tên 2-3 địa điểm nổi bật gần đó trong bán kính đi bộ được",
          "opening_hours": "6:00 - 11:30, 13:30 - 16:00 (hoặc để trống nếu không biết)",
          "entrance_fee": "Miễn phí / 30.000đ / ... (hoặc để trống nếu không biết)",
          "website": "https://... (hoặc để trống nếu không biết)",
          "transport_to_next": "🚶 Đi bộ ~5 phút"
        }}
      ]
    }}
  ],
  "accommodation": [
    {{"name": "...", "area": "...", "price_range": "...",
      "why": "...", "lat": 0.0, "lng": 0.0}}
  ],
  "packing_list": ["..."],
  "budget_breakdown": {{
    "luu_tru": "...", "an_uong": "...", "di_chuyen": "...",
    "hoat_dong": "...", "mua_sam_phat_sinh": "..."
  }},
  "agent_notes": "..."
}}"""

    itinerary = _run_agent_new_sdk(system_prompt, user_prompt) if _USE_NEW_SDK \
        else _run_agent_old_sdk(system_prompt, user_prompt)
    itinerary = optimize_itinerary_routes(itinerary)
    itinerary = _augment_accommodation_suggestions(itinerary, destination, budget)
    return itinerary


def _run_agent_new_sdk(system_prompt: str, user_prompt: str) -> dict:
    tools = [genai_types.Tool(function_declarations=[
        genai_types.FunctionDeclaration(**t) for t in TOOL_DECLARATIONS
    ])]
    config = genai_types.GenerateContentConfig(
        system_instruction=system_prompt, tools=tools, temperature=0.7)
    messages = [genai_types.Content(role="user",
                parts=[genai_types.Part(text=user_prompt)])]

    for _ in range(10):
        response = client.models.generate_content(
            model="gemini-2.5-flash", contents=messages, config=config)
        parts = response.candidates[0].content.parts
        messages.append(genai_types.Content(role="model", parts=parts))

        tool_calls = [p for p in parts if hasattr(p, "function_call") and p.function_call]
        if not tool_calls:
            raw = "\n".join(p.text for p in parts if hasattr(p, "text") and p.text).strip()
            return _parse_json(raw)

        results = []
        for p in tool_calls:
            fc = p.function_call
            results.append(genai_types.Part(
                function_response=genai_types.FunctionResponse(
                    name=fc.name, response={"result": _execute_tool(fc.name, dict(fc.args))}
                )
            ))
        messages.append(genai_types.Content(role="user", parts=results))

    raise RuntimeError("Agent vượt quá 10 vòng lặp")


def _run_agent_old_sdk(system_prompt: str, user_prompt: str) -> dict:
    model = genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=system_prompt,
        tools=[{"function_declarations": TOOL_DECLARATIONS}],
    )
    chat = model.start_chat()
    response = chat.send_message(user_prompt)

    for _ in range(10):
        tool_calls = [p.function_call for p in response.parts
                      if hasattr(p, "function_call") and p.function_call.name]
        if not tool_calls:
            return _parse_json((response.text or "").strip())
        response = chat.send_message([
            genai.protos.Part(function_response=genai.protos.FunctionResponse(
                name=fc.name, response={"result": _execute_tool(fc.name, dict(fc.args))}
            )) for fc in tool_calls
        ])

    raise RuntimeError("Agent vượt quá 10 vòng lặp")


def _parse_json(raw: str) -> dict:
    raw = re.sub(r'^```json\s*', '', raw, flags=re.MULTILINE)
    raw = re.sub(r'^```\s*',     '', raw, flags=re.MULTILINE)
    raw = re.sub(r'\s*```$',     '', raw, flags=re.MULTILINE)
    raw = raw.strip()
    m = re.search(r'\{.*\}', raw, re.DOTALL)
    return json.loads(m.group(0) if m else raw)
