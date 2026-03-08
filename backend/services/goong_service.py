from __future__ import annotations

from typing import Any

import requests

from config import settings

GOONG_KEY = getattr(settings, "goong_api_key", "")
GOONG_TIMEOUT = 8

HTTP = requests.Session()


class GoongError(Exception):
    pass


def _ensure_key() -> None:
    if not GOONG_KEY:
        raise GoongError("Chua cau hinh GOONG_API_KEY trong backend/.env")


def _http_get(url: str, params: dict[str, Any]) -> dict[str, Any]:
    _ensure_key()
    q = dict(params or {})
    q["api_key"] = GOONG_KEY
    resp = HTTP.get(url, params=q, timeout=GOONG_TIMEOUT)
    resp.raise_for_status()
    payload = resp.json()
    status = str(payload.get("status", "")).upper()
    # Goi y tu Goong thuong tra "OK", "ZERO_RESULTS"...
    if status and status not in {"OK", "ZERO_RESULTS"}:
        raise GoongError(payload.get("error_message") or f"Goong status={status}")
    return payload


def autocomplete(query: str, limit: int = 6) -> dict[str, Any]:
    payload = _http_get(
        "https://rsapi.goong.io/Place/AutoComplete",
        {"input": query, "limit": max(1, min(limit, 10)), "more_compound": True},
    )
    suggestions = []
    for p in payload.get("predictions", []) or []:
        structured = p.get("structured_formatting") or {}
        suggestions.append(
            {
                "place_id": p.get("place_id"),
                "description": p.get("description") or "",
                "main_text": structured.get("main_text") or "",
                "secondary_text": structured.get("secondary_text") or "",
            }
        )
    return {"suggestions": suggestions, "source": "goong"}


def forward_geocode(address: str) -> dict[str, Any]:
    payload = _http_get(
        "https://rsapi.goong.io/Geocode",
        {"address": address},
    )
    results = []
    for item in payload.get("results", []) or []:
        loc = (item.get("geometry") or {}).get("location") or {}
        results.append(
            {
                "formatted_address": item.get("formatted_address") or "",
                "place_id": item.get("place_id") or "",
                "lat": loc.get("lat"),
                "lng": loc.get("lng"),
            }
        )
    return {"results": results, "source": "goong"}


def reverse_geocode(lat: float, lng: float) -> dict[str, Any]:
    payload = _http_get(
        "https://rsapi.goong.io/Geocode",
        {"latlng": f"{lat},{lng}"},
    )
    results = []
    for item in payload.get("results", []) or []:
        loc = (item.get("geometry") or {}).get("location") or {}
        results.append(
            {
                "formatted_address": item.get("formatted_address") or "",
                "place_id": item.get("place_id") or "",
                "lat": loc.get("lat"),
                "lng": loc.get("lng"),
            }
        )
    return {"results": results, "source": "goong"}


def place_detail(place_id: str) -> dict[str, Any]:
    payload = _http_get(
        "https://rsapi.goong.io/Place/Detail",
        {"place_id": place_id},
    )
    result = payload.get("result") or {}
    loc = (result.get("geometry") or {}).get("location") or {}
    return {
        "result": {
            "name": result.get("name") or "",
            "formatted_address": result.get("formatted_address") or "",
            "place_id": result.get("place_id") or place_id,
            "phone_number": result.get("formatted_phone_number") or "",
            "website": result.get("website") or "",
            "rating": result.get("rating"),
            "lat": loc.get("lat"),
            "lng": loc.get("lng"),
            "opening_hours": (result.get("opening_hours") or {}).get("weekday_text") or [],
        },
        "source": "goong",
    }


def direction(origin: str, destination: str, vehicle: str = "car") -> dict[str, Any]:
    payload = _http_get(
        "https://rsapi.goong.io/Direction",
        {"origin": origin, "destination": destination, "vehicle": vehicle},
    )
    routes = []
    for r in payload.get("routes", []) or []:
        legs = r.get("legs") or []
        distance_m = 0
        duration_s = 0
        for leg in legs:
            distance_m += int((leg.get("distance") or {}).get("value") or 0)
            duration_s += int((leg.get("duration") or {}).get("value") or 0)
        routes.append(
            {
                "distance_m": distance_m,
                "duration_s": duration_s,
                "polyline": (r.get("overview_polyline") or {}).get("points") or "",
                "legs": legs,
            }
        )
    return {"routes": routes, "source": "goong"}


def distance_matrix(
    origins: str,
    destinations: str,
    vehicle: str = "car",
) -> dict[str, Any]:
    payload = _http_get(
        "https://rsapi.goong.io/DistanceMatrix",
        {"origins": origins, "destinations": destinations, "vehicle": vehicle},
    )
    rows = payload.get("rows") or []
    matrix = []
    for row in rows:
        parsed_row = []
        for el in row.get("elements") or []:
            parsed_row.append(
                {
                    "status": el.get("status"),
                    "distance_m": (el.get("distance") or {}).get("value"),
                    "duration_s": (el.get("duration") or {}).get("value"),
                }
            )
        matrix.append(parsed_row)
    return {"matrix": matrix, "source": "goong"}
