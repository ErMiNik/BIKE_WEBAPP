import { useState, useEffect, use } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L, { geoJSON } from "leaflet";
import polyline from "@mapbox/polyline";
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

function MapView (){
  
  const [decodedRoute, setDecodedRoute] = useState("")
  const [location, setLocation] = useState(null)
  const defaultLocation = [48.15346810283932, 17.071976065635685];
  
  const getPolyline = (e) => {
    // Fetch polyline from backend
    fetch("http://localhost:5000/api/mapview")
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      const decoded = polyline.decode(data.polyline);

      setLocation(decoded[0])
      setDecodedRoute((prevDecodedRoute) => [...prevDecodedRoute, ...decoded]); // prejdenu_trasu += nova_trasa
      
      })
      .catch((err) => console.error("Failed to load polyline:", err));
  };

  return (
    <MapContainer center={defaultLocation} zoom={13} scrollWheelZoom={true} whenReady={getPolyline}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToLocation location={location ? location : defaultLocation}/>
      <Polyline positions={decodedRoute} />
    </MapContainer>
  );
};

export default MapView;
