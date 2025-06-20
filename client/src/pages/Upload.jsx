import { useState, useEffect, use } from "react";
import "../css/Upload.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useMapEvents, useGeoLocation } from "react-leaflet/hooks";
import L, { geoJSON } from "leaflet";
import "leaflet/dist/leaflet.css";

function FlyToLocation({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.flyTo(location, 16, {
        duration: 1,
      });
    }
  }, [location, map]);

  return null;
}

function SetMarker({ setLocation }) {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    },
  });

  return null;
}

function Upload() {
  const default_location = [48.15346810283932, 17.071976065635685];
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);

  const handleName = (e) => {
    setName(e.target.value);
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

  const fetchLocation = (e) => {
    setFetching(true);
    const geoLoc = navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = [latitude, longitude];
        setLocation(coords);
      },
      (err) => {
        setError(err);
        alert("Error fetching locatoin:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (location) {
      setFetching(false);
      console.log("Location updated:", location);
    }
  }, [location]);

  useEffect(() => {
    console.log(name);
  }, [name]);

  useEffect(() => {
    console.log(files);
    console.log(files.length);
  }, [files]);

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
        {files.length > 0 && (
          <div className="image-container">
            {files.map((file, index) => {
              if (file.type.startsWith("image/")) {
                const previewUrl = URL.createObjectURL(file);
                return (
                  <div>
                    <img
                      key={index}
                      src={previewUrl}
                      alt={file.name}
                      style={{
                        objectFit: "cover",
                      }}
                      onLoad={() => URL.revokeObjectURL(previewUrl)}
                    />
                    <span>{file.name}</span>
                  </div>
                );
              }
            })}
          </div>
        )}

        <button
          className="btn"
          disabled={fetching}
          type="button"
          onClick={fetchLocation}
        >
          Fetch Location
        </button>

        {fetching && (
          <>
            <span>Fetching location</span>
          </>
        )}

        {
          <div
            className="leaflet-map"
            style={{ height: "400px", marginTop: "20px" }}
          >
            <MapContainer
              center={location || default_location}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
              whenReady={fetchLocation}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <Marker position={location ? location : default_location}>
                <Popup>Your location :3</Popup>
              </Marker>
              <FlyToLocation location={location} />
              {!fetching && <SetMarker setLocation={setLocation} />}
            </MapContainer>
          </div>
        }

        <button
          disabled={!location || !name || files.length == 0}
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
