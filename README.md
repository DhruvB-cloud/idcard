# Dhruv Bisht | Full Stack Developer

My personal portfolio and resume site, built from scratch with plain HTML, CSS and JavaScript (no frameworks) and hosted free on GitHub Pages.

**Live site:** https://dhruvb-cloud.github.io/idcard/

## What's on it

- **Projects:** FridgeChef (Python, Kivy, Flask on Google Cloud Run), AppHub (Cloudflare Workers, D1, KV) and BookBuds (native Android in Java), each with a "What I built" popup
- **Experience** at Mooments, plus education
- **Skills:** only the ones my projects use
- **Beyond code:** workshops, events and community work
- A downloadable resume (PDF)

## Features

- Dark and light themes (follows the visitor's system setting, remembers their choice)
- Works on phones, with a slide-down menu
- Typing animation, scroll-reveal sections, animated counters and a scroll progress bar
- Popups for project and event details, filterable event cards
- Accessible: skip link, keyboard support, screen-reader labels, respects "reduce motion"
- Search and link-preview (Open Graph) tags for sharing on LinkedIn
- ...and a hidden easter egg 🥚

## Folder layout

| Path | What it is |
|---|---|
| `index.html` | Page structure |
| `css/style.css` | Look and feel: colours, themes, layout, animations |
| `css/easter-egg.css` | Styles for the secret themes |
| `js/data.js` | **All the text content.** Edit this file to update the site. |
| `js/main.js` | Builds the sections from `data.js` and runs the interactive parts |
| `js/easter-egg.js` | The secret feature |
| `assets/` | Images, resume PDF and the link-preview image |
| `serve.py` | Local test server (`python serve.py`, then open http://localhost:8000) |

## Updating

1. Edit `js/data.js` (image paths must match file names exactly, including capital letters).
2. Test locally with `python serve.py`.
3. `git add .`, `git commit -m "..."`, then `git push`. GitHub Pages updates the live site in about a minute.
