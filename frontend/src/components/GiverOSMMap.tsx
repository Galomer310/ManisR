import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

interface GiverOSMMapProps {
  lat: number; // coordinates for center
  lng: number;
}

const GiverOSMMap: React.FC<GiverOSMMapProps> = ({ lat, lng }) => {
  const position: [number, number] = [lat, lng];
  console.log("Rendering map with lat/lng:", lat, lng);

  return (
    // Zoom=14 is somewhat close; adjust as needed
    <MapContainer
      center={position}
      zoom={14}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        // Free OSM tile server
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>Pickup location</Popup>
      </Marker>
    </MapContainer>
  );
};

export default GiverOSMMap;
