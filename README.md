# Jinrui Han's Homepage

Source for [bwrooney82.github.io](https://bwrooney82.github.io/), a static academic homepage built with Python, Jinja2, and YAML.

## Local preview

```sh
python3 -m venv .venv
source .venv/bin/activate
python3 -m pip install -r requirements.txt
python3 build.py --serve
```

Open [localhost:4000](http://localhost:4000/). The server rebuilds `index.html` when data or templates change; refresh the browser to see updates.

## Editing

- `_data/about.yaml`: biography, profile photo, and social links.
- `_data/news.yaml`: news entries, newest first.
- `_data/research.yaml`: papers and categories. Set `author-role` for a first/co-first author paper to highlight its row; omit it for other papers.
- `_data/affiliations.yaml`: education.
- `_layouts/main.html`, `_sections/`, `_libs/research_widget.html`: page templates.
- `styles/styles.css`, `js/scripts.js`: appearance and interactions.
- `assets/`: the images, animations, video, and self-hosted Inter font used by the page.
- `_config.yml`: page title and favicon.

Paper media sources are recorded in `_data/research.yaml`. The final robot-cat icon source and generation record are `assets/img/github-cat-robot-transparent.png` and its adjacent JSON file; the favicon and touch icon are resized versions. The Inter license is retained in `assets/fonts/Inter-OFL.txt`.

## Publishing

```sh
python3 build.py
git diff --check
```

Commit the generated `index.html` together with the source and asset changes, then push to `main`. GitHub Pages serves the static files directly; `.nojekyll` disables Jekyll processing. Edit the templates or data rather than `index.html`.

Originally based on [mkhangg/academic-website](https://github.com/mkhangg/academic-website).
