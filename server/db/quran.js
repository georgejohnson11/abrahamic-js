import Database from 'better-sqlite3';

export class QuranDB {
  constructor(dbPath) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  getAllSurahs() {
    return this.db.prepare('SELECT * FROM sura').all();
  }

  getVerses(surahId) {
    return this.db.prepare(
      'SELECT * FROM ayat WHERE suraid = ? ORDER BY verse_num ASC'
    ).all(surahId);
  }

  getSurahName(surahId) {
    const result = this.db.prepare(
      'SELECT name_ar FROM sura WHERE suraid = ?'
    ).get(surahId);
    return result?.name_ar || null;
  }

  getTafseerBooks() {
    return this.db.prepare('SELECT * FROM tafseer_books').all();
  }

  getTafseerVerse(surahId, bookId, verseNum) {
    const result = this.db.prepare(`
      SELECT tafseer FROM tafseer_text
      WHERE suraid = ? AND bookid = ? AND verse_num = ?
    `).get(surahId, bookId, verseNum);
    return result?.tafseer || null;
  }

  search(term) {
    // Remove diacritics
    const cleanTerm = term.replace(/[ًٌٍَُِّْ]/g, '');
    
    const results = this.db.prepare(`
      SELECT a.*, s.name_ar AS suraname
      FROM ayat a
      JOIN sura s ON s.suraid = a.suraid
      WHERE a.verse_txt LIKE ?
      ORDER BY a.suraid ASC, a.verse_num ASC
    `).all('%' + cleanTerm + '%');

    return {
      count: results.length,
      results: results.map(row => ({
        ...row,
        versenum: row.verse_num,
        suranum: row.suraid,
        verse_txt_highlighted: this.highlightSearchTerms(row.verse_txt, cleanTerm)
      }))
    };
  }

  highlightSearchTerms(text, term) {
    const searchWords = term.split(' ');
    let highlighted = text;
    
    searchWords.forEach(word => {
      const regex = new RegExp(`(\\b\\w*${word}\\w*\\b)`, 'giu');
      highlighted = highlighted.replace(regex, '<span class="highlight">$1</span>');
    });
    
    return highlighted;
  }

  close() {
    this.db.close();
  }
}