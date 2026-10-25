import json
import re
from pathlib import Path

from backend.app.routers.calls import CallIn

ASSETS = Path(__file__).resolve().parents[1] / "frontend" / "assets"


def script():
    return json.loads((ASSETS / "call.json").read_text())


def test_the_call_has_five_lines_in_hindi_roman_and_english():
    lines = script()["lines"]
    assert len(lines) == 5
    for line in lines:
        assert all(line[k].strip() for k in ("hi", "roman", "en"))
        assert any("ऀ" <= ch <= "ॿ" for ch in line["hi"])
        assert not any("ऀ" <= ch <= "ॿ" for ch in line["en"] + line["roman"])


def test_every_line_has_a_voice_clip_in_each_language():
    for lang in ("en", "hi"):
        for n in range(1, 6):
            clip = ASSETS / "call" / f"{lang}-{n:02d}.mp3"
            assert clip.exists() and clip.stat().st_size > 5_000, clip.name


def test_reply_options_are_outcomes_the_api_accepts():
    replies = script()["replies"]
    assert [r["outcome"] for r in replies] == ["admitted", "denied", "unsure", "noanswer"]
    for r in replies:
        assert r["hi"].strip() and r["en"].strip()
        CallIn(account_id="SBI:1", outcome=r["outcome"], reply_label=r["en"])


def test_the_served_app_has_the_call_script_and_clips(client):
    assert client.get("/assets/call.json").status_code == 200
    r = client.get("/assets/call/hi-03.mp3")
    assert r.status_code == 200 and r.headers["content-type"] == "audio/mpeg"


def test_the_tour_voice_cannot_be_sped_up_past_one_and_a_half():
    src = (ASSETS / "tour.js").read_text()
    rates = [float(x) for x in re.search(r"var RATES = \[([^\]]*)\]", src).group(1).split(",")]
    assert rates == [1, 1.25, 1.5] and max(rates) == 1.5
