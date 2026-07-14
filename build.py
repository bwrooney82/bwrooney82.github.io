#!/usr/bin/env python3
"""Build the website: render _layouts/main.html with _data/*.yaml into index.html.

Usage:
    python3 build.py            # build index.html
    python3 build.py --serve    # build, then serve at http://localhost:4000
                                # (rebuilds automatically when files change)

Requires: pyyaml, jinja2  (pip3 install --user pyyaml jinja2)
"""

import sys
import time
from pathlib import Path
from types import SimpleNamespace

import yaml
from jinja2 import ChainableUndefined, Environment, FileSystemLoader

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "index.html"
# directories/files that build.py reads; --serve watches these for changes
WATCH = ["_config.yml", "_data", "_layouts", "_sections", "_libs"]


def normalize_keys(obj):
    """YAML keys use hyphens (e.g. profile-pic); Jinja identifiers can't, so
    rename keys to underscores. Dicts become attribute objects so templates can
    write data.news.items (a plain dict would resolve .items to the method)."""
    if isinstance(obj, dict):
        return SimpleNamespace(
            **{str(k).replace("-", "_"): normalize_keys(v) for k, v in obj.items()}
        )
    if isinstance(obj, list):
        return [normalize_keys(v) for v in obj]
    return "" if obj is None else obj  # empty YAML fields render as "", not "None"


def load_yaml(path):
    with open(path, encoding="utf-8") as f:
        return normalize_keys(yaml.safe_load(f) or {})


def build():
    site = load_yaml(ROOT / "_config.yml")
    data = {p.stem: load_yaml(p) for p in sorted((ROOT / "_data").glob("*.yaml"))}

    env = Environment(
        loader=FileSystemLoader(ROOT),
        undefined=ChainableUndefined,  # missing fields render as empty, like Liquid
        keep_trailing_newline=True,
    )
    try:  # match Liquid's markdownify when the markdown package is available
        import markdown

        env.filters["markdownify"] = lambda text: markdown.markdown(str(text)) if text else text
    except ImportError:
        env.filters["markdownify"] = lambda text: text

    html = env.get_template("_layouts/main.html").render(site=site, data=data)
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"built {OUTPUT.relative_to(ROOT)} ({len(html)} bytes)")


def snapshot():
    """Return mtimes of all watched files, to detect changes."""
    stamps = {}
    for name in WATCH:
        path = ROOT / name
        for f in [path] if path.is_file() else sorted(path.rglob("*")):
            if f.is_file():
                stamps[f] = f.stat().st_mtime
    return stamps


def serve(port=4000):
    import http.server
    import threading

    server = http.server.ThreadingHTTPServer(
        ("localhost", port),
        lambda *a: http.server.SimpleHTTPRequestHandler(*a, directory=str(ROOT)),
    )
    threading.Thread(target=server.serve_forever, daemon=True).start()
    print(f"serving at http://localhost:{port} (Ctrl-C to stop)")

    last = snapshot()
    try:
        while True:
            time.sleep(1)
            current = snapshot()
            if current != last:
                last = current
                try:
                    build()
                except Exception as e:
                    print(f"build error: {e}")
    except KeyboardInterrupt:
        print("\nstopped")


if __name__ == "__main__":
    build()
    if "--serve" in sys.argv:
        serve()
