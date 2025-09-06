"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L, { LatLng } from "leaflet";

function LocationMarker() {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>你的位置</Popup>
    </Marker>
  );
}

export default function Map() {
  const markers = [
    {
      position: [24.182497764397755, 120.60254903369824] as [number, number],
      title: "東海大學",
      address: "台中市西屯區台灣大道四段 1727 號",
    },
    {
      position: [24.17916342897932, 120.62219792331376] as [number, number],
      title: "中港轉運站",
      address: "台中市西屯區台灣大道四段 637 號",
    },
    {
      position: [24.137287227178724, 120.68692490598748] as [number, number],
      title: "台中火車站",
      address: "臺中市中區臺灣大道一段 1 號",
    },
  ];

  useEffect(() => {
    const DefaultIcon = L.icon({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = DefaultIcon;
  }, []);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <MapContainer
        center={[24.17946276387594, 120.60027705548224]} // 東海大學中間
        zoom={17}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>
              <div className="text-center">
                <h3 className="font-bold">{marker.title}</h3>
                <p className="text-sm text-gray-600">{marker.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
