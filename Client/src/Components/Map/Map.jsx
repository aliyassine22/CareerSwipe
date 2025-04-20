import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = [31.7683, 35.2137]; // Default to Jerusalem

const MapEvents = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        const { lat, lng } = e.latlng;
        onMapClick({ lat, lng });
      }
    },
  });
  return null;
};

// Recenter map when center prop changes
const Recenter = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (Array.isArray(center) && center.length === 2) {
      map.setView(center);
    }
  }, [center]);
  return null;
};

const Map = ({ center = defaultCenter, zoom = 13, markers = [], onMapClick }) => {
  const mapCenter = Array.isArray(center) ? center : [center.lat, center.lng];
  
  return (
    <MapContainer style={containerStyle} center={mapCenter} zoom={zoom} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapEvents onMapClick={onMapClick} />
      <Recenter center={mapCenter} />
      {markers.map((position, idx) => {
        const markerPosition = Array.isArray(position) ? position : [position.lat, position.lng];
        return <Marker key={idx} position={markerPosition} />;
      })}
    </MapContainer>
  );
};

export default React.memo(Map);
