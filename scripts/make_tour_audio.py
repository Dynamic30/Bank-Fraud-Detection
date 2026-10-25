"""Generate the guided-demo voiceover with ElevenLabs: one mp3 per card and language.

    ELEVENLABS_API_KEY=... python scripts/make_tour_audio.py            # only missing files
    ELEVENLABS_API_KEY=... python scripts/make_tour_audio.py --force    # all of them again

The words come from frontend/assets/tour.json (the same file the app shows), the audio goes to
frontend/assets/tour/<lang>-<nn>.mp3. Change a card's text, run with --force (or delete its files), commit the mp3s.
"""
import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

ASSETS = Path(__file__).resolve().parents[1] / "frontend" / "assets"
MODEL = "eleven_multilingual_v2"
FORMAT = "mp3_44100_64"


def speak(voice, text, key):
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format={FORMAT}", method="POST",
        data=json.dumps({"text": text, "model_id": MODEL}).encode(),
        headers={"xi-api-key": key, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--force", action="store_true", help="regenerate files that already exist")
    ap.add_argument("--only", help="a card id, to do just that one")
    args = ap.parse_args()
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("set ELEVENLABS_API_KEY")
    data = json.loads((ASSETS / "tour.json").read_text())
    out = ASSETS / "tour"
    out.mkdir(exist_ok=True)
    made = chars = 0
    for n, card in enumerate(data["cards"], 1):
        if args.only and card["id"] != args.only:
            continue
        for lang in ("en", "hi"):
            path = out / f"{lang}-{n:02d}.mp3"
            if path.exists() and not args.force:
                continue
            text = card["text"][lang]
            path.write_bytes(speak(data["voices"][lang], text, key))
            made += 1
            chars += len(text)
            print(f"{path.name}  {len(text)} characters")
    print(f"{made} clips, {chars} characters")


if __name__ == "__main__":
    main()
