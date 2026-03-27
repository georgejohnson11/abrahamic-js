import Database from 'better-sqlite3';

export class BibleDB {
  constructor(dbPath) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  getAllBooks() {
    return this.db.prepare(
      'SELECT id, name FROM books ORDER BY id ASC'
    ).all();
  }

  getBookInfo(bookId) {
    return this.db.prepare(
      'SELECT id, name FROM books WHERE id = ? LIMIT 1'
    ).get(bookId);
  }

  getChaptersCount(bookId) {
    const result = this.db.prepare(
      'SELECT MAX(Chapter) AS n FROM bible WHERE Book = ?'
    ).get(bookId);
    return result?.n || 0;
  }

  getVerses(bookId, chapter) {
    return this.db.prepare(`
      SELECT Book,
             Chapter,
             Versecount AS verse_number,
             verse AS text
      FROM bible
      WHERE Book = ? AND Chapter = ?
      ORDER BY Versecount ASC
    `).all(bookId, chapter);
  }

  searchVerses(term, limit = 100, offset = 0) {
    return this.db.prepare(`
      SELECT b.Book,
             b.Chapter,
             b.Versecount AS verse_number,
             b.verse AS text,
             bo.name AS book_name
      FROM bible b
      JOIN books bo ON b.Book = bo.id
      WHERE b.verse LIKE ?
      ORDER BY b.Book ASC, b.Chapter ASC, b.Versecount ASC
      LIMIT ? OFFSET ?
    `).all('%' + term + '%', limit, offset);
  }

  countSearchResults(term) {
    const result = this.db.prepare(
      'SELECT COUNT(*) as count FROM bible WHERE verse LIKE ?'
    ).get('%' + term + '%');
    return result?.count || 0;
  }

  close() {
    this.db.close();
  }
}