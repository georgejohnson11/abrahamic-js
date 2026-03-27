import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Button, Form, ListGroup, Card, Alert } from 'react-bootstrap'
import { bibleAPI } from '../api'
import '../styles/BibleReader.css'

export default function BibleReader() {
  const { bookId = '1', chapterId = '1' } = useParams()
  const navigate = useNavigate()
  
  const [books, setBooks] = useState([])
  const [verses, setVerses] = useState([])
  const [chaptersCount, setChaptersCount] = useState(0)
  const [bookInfo, setBookInfo] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [fontSize, setFontSize] = useState(20)
  const [theme, setTheme] = useState('light')
  const [loading, setLoading] = useState(false)

  // Load books on mount
  useEffect(() => {
    bibleAPI.getBooks().then(res => setBooks(res.data)).catch(console.error)
  }, [])

  // Load theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bible-theme') || 'light'
    setTheme(saved)
    document.documentElement.setAttribute('data-bs-theme', saved)
  }, [])

  // Load chapter data
  useEffect(() => {
    const bid = parseInt(bookId)
    const cid = parseInt(chapterId)
    
    setLoading(true)
    Promise.all([
      bibleAPI.getBook(bid),
      bibleAPI.getChaptersCount(bid),
      bibleAPI.getVerses(bid, cid)
    ]).then(([bookRes, countRes, versesRes]) => {
      setBookInfo(bookRes.data)
      setChaptersCount(countRes.data.count)
      setVerses(versesRes.data)
    }).catch(console.error).finally(() => setLoading(false))
  }, [bookId, chapterId])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    try {
      const res = await bibleAPI.search(searchQuery)
      setSearchResults(res.data)
      navigate('/bible/search')
    } catch (error) {
      console.error(error)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('bible-theme', newTheme)
    document.documentElement.setAttribute('data-bs-theme', newTheme)
  }

  const bid = parseInt(bookId)
  const cid = parseInt(chapterId)
  const prevChapter = cid > 1 ? cid - 1 : null
  const nextChapter = cid < chaptersCount ? cid + 1 : null

  return (
    <Row>
      {/* Sidebar */}
      <Col md={3} className="mb-4">
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <span>Books</span>
            <Button variant="link" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <ListGroup variant="flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {books.map(book => (
                <ListGroup.Item
                  key={book.id}
                  active={book.id === bid}
                  onClick={() => navigate(`/bible/${book.id}/1`)}
                  style={{ cursor: 'pointer' }}
                >
                  {book.name}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>

      {/* Main content */}
      <Col md={9}>
        {/* Search form */}
        <Form onSubmit={handleSearch} className="mb-4">
          <Form.Group className="d-flex gap-2">
            <Form.Control
              type="text"
              placeholder="Search verses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="primary" type="submit">Search</Button>
          </Form.Group>
        </Form>

        {loading ? (
          <Alert variant="info">Loading...</Alert>
        ) : (
          <>
            {/* Chapter header */}
            <div className="mb-4">
              <h1>{bookInfo?.name}</h1>
              <p className="text-muted">Chapter {cid}</p>
            </div>

            {/* Font control */}
            <div className="mb-4 d-flex align-items-center gap-3">
              <label>Font Size:</label>
              <input
                type="range"
                min="14"
                max="28"
                value={fontSize}
                onChange={(e) => {
                  const size = parseInt(e.target.value)
                  setFontSize(size)
                  localStorage.setItem('bible-font-size', size)
                }}
                className="form-range"
                style={{ width: '150px' }}
              />
              <span>{fontSize}px</span>
            </div>

            {/* Chapter navigation */}
            <div className="mb-4 d-flex gap-2">
              <Button
                variant="outline-secondary"
                disabled={!prevChapter}
                onClick={() => navigate(`/bible/${bid}/${prevChapter}`)}
              >
                ← Prev
              </Button>
              <div className="d-flex gap-1 overflow-auto flex-wrap">
                {Array.from({ length: chaptersCount }, (_, i) => i + 1).map(ch => (
                  <Button
                    key={ch}
                    variant={ch === cid ? 'primary' : 'outline-primary'}
                    size="sm"
                    onClick={() => navigate(`/bible/${bid}/${ch}`)}
                  >
                    {ch}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline-secondary"
                disabled={!nextChapter}
                onClick={() => navigate(`/bible/${bid}/${nextChapter}`)}
              >
                Next →
              </Button>
            </div>

            {/* Verses */}
            <div className="verses-container" style={{ fontSize: `${fontSize}px` }}>
              {verses.map((verse, idx) => (
                <div key={idx} className="verse mb-3 p-2 border-start border-primary">
                  <sup className="text-primary fw-bold">{verse.verse_number}</sup>
                  {' '}
                  <span>{verse.text}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Col>
    </Row>
  )
}