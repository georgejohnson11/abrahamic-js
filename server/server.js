import express from 'express';
import cors from 'cors';
import { BibleDB } from './db/bible.js';
import { QuranDB } from './db/quran.js';

const app = express();
app.use(cors());
app.use(express.json());

const bible = new BibleDB('../db/bible.db');
const quran = new QuranDB('../db/quran.db');

// ────── BIBLE ROUTES ──────

app.get('/api/bible/books', async (req, res) => {
  try {
    const books = await bible.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bible/books/:bookId', async (req, res) => {
  try {
    const book = await bible.getBookInfo(parseInt(req.params.bookId));
    res.json(book || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bible/books/:bookId/chapters/:chapterId/verses', async (req, res) => {
  try {
    const verses = await bible.getVerses(
      parseInt(req.params.bookId),
      parseInt(req.params.chapterId)
    );
    res.json(verses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bible/books/:bookId/chapters-count', async (req, res) => {
  try {
    const count = await bible.getChaptersCount(parseInt(req.params.bookId));
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bible/search', async (req, res) => {
  try {
    const { q } = req.query;
    const results = await bible.searchVerses(q || '');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────── QURAN ROUTES ──────

app.get('/api/quran/surahs', async (req, res) => {
  try {
    const surahs = await quran.getAllSurahs();
    res.json(surahs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quran/surahs/:surahId/verses', async (req, res) => {
  try {
    const verses = await quran.getVerses(parseInt(req.params.surahId));
    res.json(verses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quran/tafseer-books', async (req, res) => {
  try {
    const books = await quran.getTafseerBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quran/tafseer/:surahId/:bookId/:verseNum', async (req, res) => {
  try {
    const { surahId, bookId, verseNum } = req.params;
    const tafseer = await quran.getTafseerVerse(
      parseInt(surahId),
      parseInt(bookId),
      parseInt(verseNum)
    );
    res.json({ tafseer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quran/search', async (req, res) => {
  try {
    const { q } = req.query;
    const results = await quran.search(q || '');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});