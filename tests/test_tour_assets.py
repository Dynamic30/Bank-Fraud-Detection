import json
from pathlib import Path

ASSETS = Path(__file__).resolve().parents[1] / "frontend" / "assets"
PAGES = {"inbox", "trail", "accounts", "holds", "action", "prevent", "model", "audit"}


def cards():
    return json.loads((ASSETS / "tour.json").read_text())["cards"]


def test_the_tour_has_fifteen_cards_in_both_languages():
    data = cards()
    assert len(data) == 15
    for card in data:
        assert card["page"] in PAGES, card["id"]
        for lang in ("en", "hi"):
            assert card["title"][lang].strip() and card["text"][lang].strip(), (card["id"], lang)
    assert len({c["id"] for c in data}) == 15


def test_every_card_has_a_voiceover_in_each_language():
    for lang in ("en", "hi"):
        for n in range(1, 16):
            clip = ASSETS / "tour" / f"{lang}-{n:02d}.mp3"
            assert clip.exists() and clip.stat().st_size > 5_000, clip.name


def test_the_hindi_cards_are_in_devanagari():
    for card in cards():
        assert any("ऀ" <= ch <= "ॿ" for ch in card["text"]["hi"]), card["id"]


def test_the_served_app_loads_the_tour_script_and_files(client):
    assert 'src="./assets/tour.js"' in client.get("/").text
    assert client.get("/assets/tour.json").status_code == 200
    r = client.get("/assets/tour/hi-07.mp3")
    assert r.status_code == 200 and r.headers["content-type"] == "audio/mpeg"
