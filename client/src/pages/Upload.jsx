import { useState, useEffect } from "react";
import "../css/Upload.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function LocationPicker({ onPick }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e) => {
      const { lat, lng } = e.latlng;
      onPick([lat, lng]);
    };

    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onPick]);

  return null;
}

function ChangeMapView({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 13);
    }
  }, [coords]);
  return null;
}

function Upload() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);

  const fetchLocation = () => {
    setFetching(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation([position.coords.latitude, position.coords.longitude]);
        setError(null);
        setFetching(false);
      },
      (err) => {
        setError(err.message);
        setFetching(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleName = (e) => {
    setName(e.target.value);
    console.log(e.target.value);
  };

  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    if (location) {
      console.log("Location updated:", location);
    }

    console.log(name);
  }, [location, name, files]);

  return (
    <div className="upload-wrapper">
      <form>
        <div className="field-wrapper">
          <label className="field-label" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            className="field"
            required={true}
            onChange={handleName}
          />
        </div>
        <div className="field-wrapper">
          <input
            className="upload-field field"
            type="file"
            name="file"
            multiple={true}
            required={true}
            onChange={handleFiles}
          />
        </div>

        <ul>
          {files.map((f, index) => (
            <li key={index}>{f.name}</li>
          ))}
        </ul>

        <button
          disabled={fetching}
          className="btn"
          type="button"
          onClick={fetchLocation}
        >
          Fetch location
        </button>

        {fetching && (
          <>
            <span>Fetching location</span>
          </>
        )}

        {location && (
          <div style={{ height: "400px", marginTop: "20px" }}>
            <MapContainer
              center={location || [51.505, -0.09]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />

              <ChangeMapView coords={[location[0], location[1]]} />
              <Marker position={[location[0], location[1]]}>
                <Popup>You are here!</Popup>
              </Marker>
              <LocationPicker onPick={(coords) => setLocation(coords)} />
            </MapContainer>
          </div>
        )}

        <button
          disabled={!location || !name || !files}
          onSubmit={handleSubmit}
          className="btn submit-btn"
          type="submit"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default Upload;
