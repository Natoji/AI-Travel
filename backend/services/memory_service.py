from __future__ import annotations

import json
from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from database import Trip, UserMemory


def _normalize_text(value: str) -> str:
    return " ".join(str(value or "").strip().lower().split())


def _load_memory_map(db: Session, user_id: int) -> dict[str, Any]:
    rows = db.query(UserMemory).filter(UserMemory.user_id == user_id).all()
    memories: dict[str, Any] = {}
    for row in rows:
        try:
            memories[row.memory_key] = json.loads(row.memory_value)
        except Exception:
            memories[row.memory_key] = row.memory_value
    return memories


def _upsert_memory(db: Session, user_id: int, key: str, value: Any) -> None:
    payload = json.dumps(value, ensure_ascii=False)
    row = (
        db.query(UserMemory)
        .filter(UserMemory.user_id == user_id, UserMemory.memory_key == key)
        .first()
    )
    if row:
        row.memory_value = payload
        row.updated_at = datetime.utcnow()
        return
    db.add(
        UserMemory(
            user_id=user_id,
            memory_key=key,
            memory_value=payload,
            updated_at=datetime.utcnow(),
        )
    )


def build_user_memory_context(db: Session, user_id: int) -> str:
    memories = _load_memory_map(db, user_id)
    if not memories:
        return ""

    recent_destinations = memories.get("recent_destinations") or []
    favorite_styles = memories.get("favorite_styles") or []
    preferred_budget = memories.get("preferred_budget") or ""
    preferred_departure_city = memories.get("preferred_departure_city") or ""

    lines = [
        "USER MEMORY (from previous trips):",
        f"- recent_destinations: {', '.join(recent_destinations) if recent_destinations else 'none'}",
        f"- favorite_styles: {', '.join(favorite_styles) if favorite_styles else 'none'}",
        f"- preferred_budget: {preferred_budget or 'unknown'}",
        f"- preferred_departure_city: {preferred_departure_city or 'unknown'}",
    ]
    return "\n".join(lines)


def update_user_memory_from_trip(
    db: Session,
    user_id: int,
    destination: str,
    budget: str,
    travel_styles: list[str],
    departure_city: str,
) -> None:
    normalized_destination = str(destination or "").strip()
    normalized_budget = str(budget or "").strip()
    normalized_departure = str(departure_city or "").strip()
    normalized_styles = [s.strip() for s in (travel_styles or []) if str(s).strip()]

    trips = (
        db.query(Trip)
        .filter(Trip.user_id == user_id)
        .order_by(Trip.created_at.desc())
        .limit(10)
        .all()
    )

    destination_set: list[str] = []
    style_counter: dict[str, int] = {}

    if normalized_destination:
        destination_set.append(normalized_destination)
    for trip in trips:
        d = str(trip.destination or "").strip()
        if d and _normalize_text(d) not in {_normalize_text(x) for x in destination_set}:
            destination_set.append(d)
        styles = [s.strip() for s in str(trip.travel_style or "").split(",") if s.strip()]
        for style in styles:
            key = _normalize_text(style)
            style_counter[key] = style_counter.get(key, 0) + 1

    for style in normalized_styles:
        key = _normalize_text(style)
        style_counter[key] = style_counter.get(key, 0) + 1

    ranked_styles = sorted(style_counter.items(), key=lambda x: x[1], reverse=True)
    favorite_styles = [name for name, _ in ranked_styles[:4] if name]

    _upsert_memory(db, user_id, "recent_destinations", destination_set[:5])
    if normalized_budget:
        _upsert_memory(db, user_id, "preferred_budget", normalized_budget)
    if normalized_departure:
        _upsert_memory(db, user_id, "preferred_departure_city", normalized_departure)
    _upsert_memory(db, user_id, "favorite_styles", favorite_styles)
