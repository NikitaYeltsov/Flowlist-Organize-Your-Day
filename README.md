# ◈ Flowlist

> A beautiful, distraction-free document editor with integrated task management — built with pure HTML, CSS, and JavaScript.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![No dependencies](https://img.shields.io/badge/dependencies-none-brightgreen?style=flat)

---

## ✦ Overview

Flowlist is a multi-page productivity web app combining a polished **landing page** with a fully functional **rich text editor**. It lets you write notes, format content, and manage tasks — all in one place, with zero backend, zero account, and zero cost to host.

---

## 🖥️ Pages

| Page | File | Description |
|------|------|-------------|
| Landing | `index.html` | Marketing page with animated logo splash, features, how-it-works, and pricing |
| App | `app.html` | Full rich-text editor with sidebar, toolbar, tasks, and autosave |

---

## ✨ Features

### Landing Page
- **Animated splash screen** — hexagonal SVG logo draws itself stroke-by-stroke on every visit
- **Scroll reveal animations** — sections fade and slide in as you scroll
- **Floating mockup** — animated app preview card in the hero section
- **Responsive** — works on mobile, tablet, and desktop
- **Sections** — Hero, Features (6 cards), How it works, Pricing, CTA

### Editor App
- **Multi-document sidebar** — create, switch between, and delete documents
- **Rich text toolbar** — Bold, Italic, Underline, Strikethrough, H2, H3, Quote, Bullet list, Numbered list, Alignment
- **Large editable title** — styled with Cormorant Garamond serif font
- **Live meta bar** — shows word count, task count, and last-updated date
- **Inline task rows** — insert checkboxes directly into your document text
- **Quick-add bar** — add tasks from the bottom bar without leaving the editor
- **Keyboard shortcuts** — `Ctrl+S` to save, `Ctrl+N` for new document, `Enter` to chain tasks
- **Autosave** — changes persist automatically after 600ms of inactivity
- **LocalStorage** — all documents saved in the browser, survive page refresh
- **Confetti** 🎉 — burst animation when you complete a task

---

## 📁 Project Structure

```
flowlist/
│
├── index.html      # Landing page
├── app.html        # Editor application
│
├── style.css       # Shared base styles (nav, buttons, footer, typography)
├── landing.css     # Landing page styles (hero, features, sections)
├── app.css         # Editor styles (sidebar, toolbar, editor page, tasks)
│
├── nav.js          # Shared navigation (scroll shadow, mobile burger menu)
├── landing.js      # Splash screen animation + scroll reveal logic
├── app.js          # Full editor logic (documents, formatting, tasks, storage)
│
└── README.md       # This file
```

---

## 🚀 Running Locally

No build step, no Node.js, no dependencies. Just open the file:

```bash
# Option 1 — open directly in browser
open index.html

# Option 2 — serve with Python (avoids any browser file:// quirks)
python3 -m http.server 3000
# then visit http://localhost:3000
```

---

## 🌐 Deploying for Free

### Netlify (easiest — drag & drop)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag the entire `flowlist/` folder onto the Netlify dashboard
3. Done — live in 30 seconds at `https://your-name.netlify.app`

### GitHub Pages
1. Push this folder to a GitHub repository
2. Go to **Settings → Pages → Source → `main` branch**
3. Live at `https://your-username.github.io/flowlist`

### Vercel
1. Go to [vercel.com](https://vercel.com) and sign up
2. Import the GitHub repo or drag-drop the folder
3. Live instantly at `https://flowlist.vercel.app`

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save current document |
| `Ctrl + N` | Create new document |
| `Ctrl + B` | Bold |
| `Ctrl + I` | Italic |
| `Ctrl + U` | Underline |
| `Enter` (in task) | Add next task below |
| `Backspace` (empty task) | Delete task row |

---

## 🎨 Design

| Element | Choice |
|---------|--------|
| Display font | Cormorant Garamond (serif, elegant) |
| UI font | Outfit (geometric, clean) |
| Primary palette | Warm cream `#f6f1e9`, deep ink `#1a1814` |
| Accent | Antique gold `#c9a84c` |
| Secondary | Olive green `#3d4a2e` / `#8fa870` |
| Animations | CSS keyframes, `cubic-bezier` spring easing |

---

## 🗄️ Data & Privacy

- All data is stored in **your browser's `localStorage`** under the key `flowlist_docs_v2`
- Nothing is sent to any server
- Clearing browser data will erase documents — export important notes manually

---

## 📄 License

MIT — free to use, modify, and distribute.
