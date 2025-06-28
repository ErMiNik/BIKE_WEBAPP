// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import PhotoData from "./pages/PhotoData";
import MapView from "./pages/MapView";
import Upload from "./pages/Upload";

function App() {
  return (
    <Router>
      <nav style={navStyle}>
        <Link to="/">Home</Link>
        <Link to="/photo_data">Photo data</Link>
        <Link to="/mapview">Trasa</Link>
        <Link to="/upload">Upload</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/photo_data" element={<PhotoData />} />
        <Route path="/mapview" element={<MapView />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="*" element={<h2>404 Not Found</h2>} />
      </Routes>
    </Router>
  );
}

const navStyle = {
  display: "flex",
  gap: "1rem",
  padding: "1rem",
  background: "#f4f4f4",
  fontSize: "1.2rem",
};

export default App;
