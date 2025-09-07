import { useState } from "react";
import { LatLng } from "leaflet";
import { useMapEvents, Marker, Popup } from "react-leaflet";

export default function LocationMarker() {
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
