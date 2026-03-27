import express from 'express';
import cors from 'cors';
import { BibleDB } from './db/bible.js';
import { QuranDB } from './db/quran.js';

const app = express();
app.use(cors());
app.use(express.json());

const bible = new BibleDB('./db/bible.db');
const quran = new QuranDB('./db/quran.db');

// ────── BIBLE ROUTES ──────

app.get('/api/bible/books', (req, res) => {
  try {
    const books = bible.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bible/books/:bookId', (req, res) => {
  try {
    const book = bible.getBookInfo(parseInt(req.params.bookId));
    res.json(book || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bible/books/:bookId/chapters/:chapterId/verses', (req, res) => {
  try {
    const verses = bible.getVerses(
      parseInt(req.params.bookId),
      parseInt(req.params.chapterId)
    );
    res.json(verses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bible/books/:bookId/chapters-count', (req, res) => {
  try {
    const count = bible.getChaptersCount(parseInt(req.params.bookId));
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/bible/search', (req, res) => {
  try {
    const { q } = req.query;
    const results = bible.searchVerses(q || '');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ────── QURAN ROUTES ──────

app.get('/api/quran/surahs', (req, res) => {
  try {
    const surahs = quran.getAllSurahs();
    res.json(surahs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quran/surahs/:surahId/verses', (req, res) => {
  try {
    const verses = quran.getVerses(parseInt(req.params.surahId));
    res.json(verses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quran/tafseer-books', (req, res) => {
  try {
    const books = quran.getTafseerBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quran/tafseer/:surahId/:bookId/:verseNum', (req, res) => {
  try {
    const { surahId, bookId, verseNum } = req.params;
    const tafseer = quran.getTafseerVerse(
      parseInt(surahId),
      parseInt(bookId),
      parseInt(verseNum)
    );
    res.json({ tafseer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/quran/search', (req, res) => {
  try {
    const { q } = req.query;
    const results = quran.search(q || '');
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(5000, () => {
  console.log('Backend server running on http://localhost:5000');
});