"""Leitura dos cards a partir dos arquivos JSON."""
import json
from pathlib import Path
from typing import Any, Dict, List, Optional

from app.core.config import CARDS_PATH, TEXTOS_PATH, VIDEOS_PATH

_SOURCES = {
    "image": CARDS_PATH,
    "video": VIDEOS_PATH,
    "text": TEXTOS_PATH,
}


def _load_json(path: Path) -> List[Dict[str, Any]]:
    if not path.exists():
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(f"Erro ao ler {path.name}: {e}")
        return []


def list_cards(media_type: str = "all") -> List[Dict[str, Any]]:
    cards: List[Dict[str, Any]] = []
    for kind, path in _SOURCES.items():
        if media_type in (kind, "all"):
            cards.extend({**item, "type": kind} for item in _load_json(path))
    return cards


def find_card(card_id: str) -> Optional[Dict[str, Any]]:
    return next((c for c in list_cards("all") if str(c.get("id")) == str(card_id)), None)
