import { useState, useEffect } from "react";
import { useMapEvents, Polyline } from "react-leaflet";

export default function DrawPolyline() {
  const [positions, setPositions] = useState<[number, number][]>([]);

  useMapEvents({
    click(e) {
      setPositions((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
    contextmenu() {
      setPositions((prev) => [...prev.slice(0, -1)]);
    },
  });

  useEffect(() => {
    if (positions.length > 0) {
      const pathString = positions
        .map((position, i) => {
          const isLast = i === positions.length - 1;
          return `  [${position[0]}, ${position[1]}]${isLast ? "" : ","}`;
        })
        .join("\n");

      console.log(`const path: [number, number][] = [\n${pathString}\n];`);
    }
  }, [positions]);

  return positions.length > 0 ? (
    <Polyline positions={positions} color="blue" />
  ) : null;
}
