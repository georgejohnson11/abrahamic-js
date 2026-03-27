import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Row, Col, Button, Form, ListGroup, Card, Alert, Modal } from 'react-bootstrap'
import { quranAPI } from '../api'
import '../styles/QuranReader.css'

export default function QuranReader() {
  const { surahId = '1' } = useParams()
  const navigate = useNavigate()
  
  const [surahs, setSurahs] = useState([])
  const [verses, setVerses] = useState([])
  const [tafseerBooks, setTafseerBooks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [fontSize, setFontSize] = useState(28)
  const [loading, setLoading] = useState(false)
  
  const [selectedTafseerBook, setSelectedTafseerBook] = useState(1)
  const [tafseerContent, setTafseerContent] = useState('')
  const [showTafseerModal, setShowTafseerModal] = useState(false)
  const [selectedVerse, setSelectedVerse] = useState(null)

  // Load surahs and tafseer books
  useEffect(() => {
    Promise.all([
      quranAPI.getSurahs(),
      quranAPI.getTafseerBooks()
    ]).then(([surahsRes, booksRes]) => {
      setSurahs(surahsRes.data)
      setTafseerBooks(booksRes.data)
    }).catch(console.error)
  }, [])

  // Load verses
  useEffect(() => {
    const sid = parseInt(surahId)
    setLoading(true)
    quranAPI.getVerses(sid)
      .then(res => setVerses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [surahId])

  const handleVerseClick = async (verse) => {
    setSelectedVerse(verse)
    try {
      const res = await quranAPI.getTafseer(
        parseInt(surahId),
        selectedTafseerBook,
        verse.verse_num
      )
      setTafseerContent(res.data.tafseer || 'No tafseer available')
      setShowTafseerModal(true)
    } catch (error) {
      console.error(error)
      setTafseerContent('Error loading tafseer')
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    // Implement search results view
  }

  const sid = parseInt(surahId)
  const currentSurah = surahs.find(s => s.suraid === sid)

  return (
    <div dir="rtl">
      <Row>
        {/* Sidebar */}
        <Col md={3} className="mb-4">
          <Card>
            <Card.Header>السور</Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                {surahs.map(surah => (
                  <ListGroup.Item
                    key={surah.suraid}
                    active={surah.suraid === sid}
                    onClick={() => navigate(`/quran/${surah.suraid}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {surah.name_ar}
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
                placeholder="ابحث في القرآن…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="primary" type="submit">بحث</Button>
            </Form.Group>
          </Form>

          {loading ? (
            <Alert variant="info">جاري التحميل…</Alert>
          ) : (
            <>
              <div className="mb-4">
                <h1>{currentSurah?.name_ar}</h1>
                <div className="d-flex gap-3 align-items-center">
                  <label>حجم الخط:</label>
                  <input
                    type="range"
                    min="16"
                    max="56"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="form-range"
                    style={{ width: '150px' }}
                  />
                  <span>{fontSize}px</span>
                </div>
              </div>

              <div className="quran-verses" style={{ fontSize: `${fontSize}px`, lineHeight: '2' }}>
                {verses.map((verse, idx) => (
                  <div
                    key={idx}
                    className="verse mb-3 p-2 cursor-pointer hover-highlight"
                    onClick={() => handleVerseClick(verse)}
                  >
                    <span>{verse.verse_txt}</span>
                    <span
                      className="ms-2 badge bg-primary cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleVerseClick(verse)
                      }}
                    >
                      {verse.verse_num}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>

      {/* Tafseer Modal */}
      <Modal show={showTafseerModal} onHide={() => setShowTafseerModal(false)} size="lg" dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title>
            تفسير الآية {selectedVerse?.verse_num}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Form.Select
              value={selectedTafseerBook}
              onChange={(e) => setSelectedTafseerBook(parseInt(e.target.value))}
            >
              {tafseerBooks.map(book => (
                <option key={book.bookid} value={book.bookid}>
                  {book.book_name}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="border p-3" style={{ minHeight: '200px' }}>
            {tafseerContent}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}