// client/src/pages/Home.jsx
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { useEffect } from 'react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// 🧭 Custom component to draw route
function Routing({ from, to }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(...from), L.latLng(...to)],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false,
    }).addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, from, to]);

  return null;
}

function Home() {
  const start = [40.7128, -74.006]; // New York
  const end = [40.73061, -73.935242]; // Brooklyn

  return (
    <div>
      <h2>Route between two points</h2>
      <MapContainer center={start} zoom={13} style={{ height: '80vh', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Routing from={start} to={end} />
      </MapContainer>
    </div>
  );
}

export default Home;
