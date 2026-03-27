import { Routes, Route, Link } from 'react-router-dom'
import { Navbar, Container } from 'react-bootstrap'
import BibleReader from './pages/BibleReader'
import QuranReader from './pages/QuranReader'
import './App.css'

export default function App() {
  return (
    <>
      <Navbar bg="light" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="/">📖 Abrahamic</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <nav className="ms-auto">
              <Link to="/bible" className="nav-link">Bible</Link>
              <Link to="/quran" className="nav-link">Quran</Link>
            </nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <Routes>
          <Route path="/bible/*" element={<BibleReader />} />
          <Route path="/quran/*" element={<QuranReader />} />
          <Route path="/" element={
            <div className="text-center mt-5">
              <h1>Welcome to Abrahamic Scriptures</h1>
              <p>Choose a scripture to explore:</p>
            </div>
          } />
        </Routes>
      </Container>
    </>
  )
}