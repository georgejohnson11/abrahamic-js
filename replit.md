# Abrahamic Scriptures

A full-stack web application for exploring Abrahamic scriptures — the Bible and the Quran.

## Architecture

- **Frontend**: React + Vite, served on port 5000
- **Backend**: Node.js + Express API, served on port 3001
- **Databases**: SQLite via better-sqlite3
  - `db/bible.db` — King James Bible with book/chapter/verse structure
  - `db/quran.db` — Quran with Arabic text, surah metadata, and tafseer (commentary)

## Project Structure

```
/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── api.js         # Axios API client (uses relative /api paths)
│   │   ├── pages/
│   │   │   ├── BibleReader.jsx
│   │   │   └── QuranReader.jsx
│   │   └── styles/
│   │       ├── BibleReader.css
│   │       └── QuranReader.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js     # Proxies /api to localhost:3001
├── server/            # Express backend
│   ├── server.js          # API routes, listens on port 3001
│   ├── db/
│   │   ├── bible.js       # BibleDB class (better-sqlite3)
│   │   └── quran.js       # QuranDB class (better-sqlite3)
│   └── package.json
└── db/                # SQLite database files
    ├── bible.db
    └── quran.db
```

## Workflows

- **Start application** — `cd frontend && npm run dev` (port 5000, webview)
- **Backend API** — `cd server && node server.js` (port 3001, console)

## API Endpoints

### Bible
- `GET /api/bible/books` — list all books
- `GET /api/bible/books/:id` — book info
- `GET /api/bible/books/:id/chapters-count` — chapter count
- `GET /api/bible/books/:id/chapters/:ch/verses` — verses
- `GET /api/bible/search?q=` — search verses

### Quran
- `GET /api/quran/surahs` — list all surahs
- `GET /api/quran/surahs/:id/verses` — verses for surah
- `GET /api/quran/tafseer-books` — available tafseer books
- `GET /api/quran/tafseer/:surah/:book/:verse` — tafseer text
- `GET /api/quran/search?q=` — search Quran text

## Key Design Decisions

- Frontend proxies `/api` calls to the backend via Vite's proxy, so no hardcoded URLs
- Backend uses `../db/` paths to access the root-level database files
- `allowedHosts: true` in Vite config for Replit proxy compatibility
