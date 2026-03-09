from __future__ import annotations

import json
from pathlib import Path
from typing import Any

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "knowledge_base.json"

class KnowledgeError(Exception):
    pass

def _normalize(text: str) -> str:
    return " ".join(str(text or "").strip().lower().split())

def _load_kb() -> dict[str, Any]:
    if not DATA_PATH.exists():
        raise KnowledgeError(f"Knowledge base file not found: {DATA_PATH}")
    try:
        with DATA_PATH.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as exc:
        raise KnowledgeError(f"Failed to load knowledge base: {exc}") from exc

def _find_destination_entry(destinations: dict[str, Any], destination: str) -> tuple[str | None, dict[str, Any] | None]:
    q = _normalize(destination)
    if not q:
        return None, None

    for key, entry in destinations.items():
        key_norm = _normalize(key)
        if key_norm in q or q in key_norm:
            return key, entry
        aliases = [_normalize(a) for a in (entry.get("aliases") or [])]
        if any(alias and (alias in q or q in alias) for alias in aliases):
            return key, entry

    return None, None

def get_destination_knowledge(destination: str, travel_styles: list[str] | None = None) -> dict[str, Any]:
    travel_styles = travel_styles or []
    kb = _load_kb()
    destinations = kb.get("destinations") or {}
    style_hints = kb.get("style_hints") or {}

    key, entry = _find_destination_entry(destinations, destination)
    matched_styles: dict[str, list[str]] = {}

    for style in travel_styles:
        style_norm = _normalize(style)
        for hint_key, hints in style_hints.items():
            hk = _normalize(hint_key)
            if hk and (hk in style_norm or style_norm in hk):
                matched_styles[hint_key] = list(hints or [])

    if not entry:
        return {
            "destination": destination,
            "matched": False,
            "message": "No exact destination knowledge found. Use tools and general planning constraints.",
            "style_hints": matched_styles,
            "source": "local_kb",
        }

    return {
        "destination": destination,
        "matched": True,
        "matched_key": key,
        "knowledge": {
            "best_months": entry.get("best_months"),
            "season_notes": entry.get("season_notes"),
            "transport_notes": entry.get("transport_notes") or [],
            "food_signatures": entry.get("food_signatures") or [],
            "local_tips": entry.get("local_tips") or [],
            "common_scams": entry.get("common_scams") or [],
        },
        "style_hints": matched_styles,
        "source": "local_kb",
    }
