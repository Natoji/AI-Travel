from __future__ import annotations

from typing import Any

import requests

from config import settings

GOONG_KEY = getattr(settings, "goong_api_key", "")
GOONG_TIMEOUT = 6

HTTP = requests.Session()

INTERCITY_KEYWORDS = (
    "sân bay", "san bay", "airport",
    "ga tàu", "ga tau", "railway", "train station",
    "bến xe", "ben xe", "bus station",
    "máy bay", "may bay", "chuyến bay", "chuyen bay",
    "tàu hỏa", "tau hoa", "xe khách", "xe khach",
)


def _to_float(value: Any):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _has_valid_coords(item: dict) -> bool:
    lat = _to_float(item.get("lat"))
    lng = _to_float(item.get("lng"))
    return lat is not None and lng is not None and lat != 0 and lng != 0


def _is_intercity_item(item: dict) -> bool:
    text = " ".join([
        str(item.get("place", "")),
        str(item.get("address", "")),
        str(item.get("description", "")),
    ]).lower()
    return any(k in text for k in INTERCITY_KEYWORDS)


def _coords_text(item: dict) -> str:
    return f"{float(item['lat'])},{float(item['lng'])}"


def _format_duration(duration_s: int) -> str:
    minutes = max(1, round(duration_s / 60))
    if minutes < 60:
        return f"{minutes} phút"
    h = minutes // 60
    m = minutes % 60
    return f"{h} giờ" if m == 0 else f"{h} giờ {m} phút"


def _estimate_transport_label(distance_m: int, duration_s: int) -> str:
    km = (distance_m or 0) / 1000
    t = _format_duration(duration_s or 0)
    if km < 1:
        return f"🚶 Đi bộ ~{t}"
    if km < 5:
        return f"🛵 Xe máy ~{t}"
    if km < 15:
        return f"🚌 Xe buýt ~{t}"
    if km < 100:
        return f"🚌 Xe khách ~{t}"
    if km < 300:
        return f"🚆 Tàu hỏa/xe khách ~{t}"
    return f"✈️ Máy bay ~{t}"


def _http_get(url: str, params: dict[str, Any]) -> dict[str, Any]:
    if not GOONG_KEY:
        return {}
    q = dict(params or {})
    q["api_key"] = GOONG_KEY
    resp = HTTP.get(url, params=q, timeout=GOONG_TIMEOUT)
    resp.raise_for_status()
    return resp.json()


def _fetch_distance_matrix(coords: list[str]) -> list[list[int]]:
    if len(coords) < 2:
        return []
    try:
        data = _http_get(
            "https://rsapi.goong.io/DistanceMatrix",
            {
                "origins": "|".join(coords),
                "destinations": "|".join(coords),
                "vehicle": "car",
            },
        )
        rows = data.get("rows") or []
        matrix: list[list[int]] = []
        for row in rows:
            out_row = []
            for el in row.get("elements") or []:
                val = (el.get("duration") or {}).get("value")
                out_row.append(int(val) if isinstance(val, (int, float)) else 10**9)
            matrix.append(out_row)
        return matrix
    except Exception:
        return []


def _fetch_direction_metrics(origin: str, destination: str) -> tuple[int, int]:
    try:
        data = _http_get(
            "https://rsapi.goong.io/Direction",
            {
                "origin": origin,
                "destination": destination,
                "vehicle": "car",
            },
        )
        routes = data.get("routes") or []
        if not routes:
            return 0, 0
        leg = ((routes[0].get("legs") or [{}])[0]) or {}
        distance_m = int((leg.get("distance") or {}).get("value") or 0)
        duration_s = int((leg.get("duration") or {}).get("value") or 0)
        return distance_m, duration_s
    except Exception:
        return 0, 0


def _nearest_neighbor_order(matrix: list[list[int]]) -> list[int]:
    n = len(matrix)
    if n <= 1:
        return list(range(n))
    unvisited = set(range(1, n))
    order = [0]
    current = 0
    while unvisited:
        nxt = min(unvisited, key=lambda j: matrix[current][j] if j < len(matrix[current]) else 10**9)
        order.append(nxt)
        unvisited.remove(nxt)
        current = nxt
    return order


def _optimize_one_day(day_obj: dict) -> None:
    schedule = day_obj.get("schedule") or []
    if len(schedule) < 4:
        return

    start_idx = 0
    end_idx = len(schedule)
    if _is_intercity_item(schedule[0]) or not _has_valid_coords(schedule[0]):
        start_idx = 1
    if _is_intercity_item(schedule[-1]) or not _has_valid_coords(schedule[-1]):
        end_idx = len(schedule) - 1

    middle = schedule[start_idx:end_idx]
    if len(middle) < 3:
        return
    if not all(_has_valid_coords(item) and not _is_intercity_item(item) for item in middle):
        return

    coords = [_coords_text(it) for it in middle]
    matrix = _fetch_distance_matrix(coords)
    if len(matrix) != len(middle):
        return

    order = _nearest_neighbor_order(matrix)
    optimized_middle = [middle[i] for i in order]
    day_obj["schedule"] = schedule[:start_idx] + optimized_middle + schedule[end_idx:]


def _fill_transport_to_next(day_obj: dict) -> None:
    schedule = day_obj.get("schedule") or []
    if not schedule:
        return
    for i in range(len(schedule) - 1):
        cur = schedule[i]
        nxt = schedule[i + 1]
        if _is_intercity_item(cur):
            cur["transport_to_next"] = ""
            continue
        if not (_has_valid_coords(cur) and _has_valid_coords(nxt)):
            cur["transport_to_next"] = cur.get("transport_to_next") or ""
            continue
        distance_m, duration_s = _fetch_direction_metrics(_coords_text(cur), _coords_text(nxt))
        if distance_m > 0 and duration_s > 0:
            cur["transport_to_next"] = _estimate_transport_label(distance_m, duration_s)
        else:
            cur["transport_to_next"] = cur.get("transport_to_next") or ""
    schedule[-1]["transport_to_next"] = ""


def optimize_itinerary_routes(itinerary: dict) -> dict:
    days = itinerary.get("days") or []
    for day_obj in days:
        _optimize_one_day(day_obj)
        _fill_transport_to_next(day_obj)
    return itinerary
