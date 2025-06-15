// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Media from './pages/Media';

function App() {
  return (
    <Router>
      <nav style={navStyle}>
        <Link to="/">Home</Link>
        <Link to="/stats">Stats</Link>
        <Link to="/media">Media</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/media" element={<Media />} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </Router>
  );
}

const navStyle = {
  display: 'flex',
  gap: '1rem',
  padding: '1rem',
  background: '#f4f4f4',
  fontSize: '1.2rem',
};



export default App;
