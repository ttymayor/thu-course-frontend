"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  Polyline,
  LayersControl,
  Tooltip,
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

function PolylineDraw() {
  const [positions, setPositions] = useState<[number, number][]>([]);

  useMapEvents({
    click(e) {
      setPositions((prev) => [...prev, [e.latlng.lat, e.latlng.lng]]);
    },
    contextmenu() {
      // 右鍵回到上一個點
      setPositions((prev) => [...prev.slice(0, -1)]);
    },
  });

  console.log(positions);
  return positions.length > 0 ? (
    <Polyline positions={positions} color="blue" />
  ) : null;
}

function BusDriveToCollegeOfSocialSciences() {
  const path: [number, number][] = [
    [24.182792128781198, 120.61222641441648],
    [24.18251660905258, 120.61315655708314],
    [24.182389373715317, 120.61315655708314],
    [24.180931051943066, 120.61296343803407],
    [24.180549340807534, 120.6127166748047],
    [24.18018720354653, 120.61230897903444],
    [24.17989847175072, 120.61182618141176],
    [24.179771233802825, 120.61128973960878],
    [24.179800596417444, 120.61061382293703],
    [24.179883790455513, 120.60991644859315],
    [24.18012358473238, 120.60816228389741],
    [24.18018720354653, 120.6075292825699],
    [24.180006134530625, 120.60708403587343],
    [24.179869109158624, 120.60689091682436],
    [24.179771233802825, 120.60690164566041],
    [24.17940420054997, 120.60618817806245],
    [24.179394412982116, 120.60610234737398],
    [24.179795702648814, 120.60393512248994],
    [24.17964399572806, 120.6036561727524],
    [24.17987400292445, 120.60273349285127],
    [24.18006485964502, 120.60213804244997],
    [24.18040742227365, 120.60136556625368],
    [24.180637428093995, 120.60078620910646],
    [24.180838071130626, 120.60003519058229],
    [24.18094083939306, 120.59968113899232],
    [24.180882114681808, 120.59945583343507],
    [24.180828283672746, 120.5994075536728],
    [24.180559128286802, 120.59942901134492],
    [24.18094573311777, 120.59793233871461],
    [24.181425317229703, 120.59736371040346],
    [24.18159659683284, 120.5968862771988],
    [24.181787450976945, 120.59580802917482],
    [24.18168957709255, 120.59574365615846],
    [24.181577022032695, 120.59576511383058],
    [24.181376380158003, 120.59567928314209],
    [24.181156163103108, 120.59566318988801],
    [24.179805490185895, 120.59523403644563],
    [24.179668464598425, 120.5952286720276],
  ];

  return (
    <Polyline positions={path} color="red" weight={5} opacity={0.8}>
      <Tooltip>公車往社會科學院（SS）路線</Tooltip>
    </Polyline>
  );
}

function BusDriveToCollegeOfManagement() {
  const path: [number, number][] = [
    [24.179663570824733, 120.59523135423663],
    [24.179668464598425, 120.59523135423663],
    [24.178870777007212, 120.59608429670337],
    [24.178547785521364, 120.59683531522752],
    [24.17841565240519, 120.59703916311267],
    [24.178107341268728, 120.59816032648088],
    [24.177662001645533, 120.59954434633256],
    [24.17771583399025, 120.59962481260301],
    [24.178518422618485, 120.60002177953722],
    [24.17952165130574, 120.600343644619],
    [24.17922313042305, 120.60090154409411],
    [24.179164404921302, 120.60106784105304],
    [24.178953971651456, 120.60138970613482],
    [24.178802263730034, 120.6017491221428],
    [24.178665237065353, 120.60200661420825],
    [24.178557573154162, 120.60219973325731],
    [24.17807308442981, 120.60396999120714],
    [24.17867502468913, 120.60413092374804],
    [24.178630980376184, 120.60439914464953],
    [24.178430333869287, 120.60530573129657],
    [24.179482501065827, 120.60569196939471],
    [24.17940420054997, 120.60609430074693],
    [24.179413988117087, 120.60618549585344],
    [24.17978102134177, 120.60689359903337],
    [24.17987400292445, 120.60688287019731],
    [24.18001102829119, 120.6070759892464],
    [24.18020188480683, 120.60753196477893],
    [24.180138266, 120.60810595750812],
    [24.17992783433607, 120.60968309640886],
    [24.18021656606544, 120.6096884608269],
    [24.18135191161512, 120.60986012220384],
    [24.181518297614215, 120.60989230871202],
    [24.181645533820088, 120.60995668172839],
    [24.181831494200424, 120.61016589403155],
    [24.182066391135567, 120.61049312353136],
    [24.182335543342138, 120.61072379350664],
    [24.182678099874813, 120.61095446348192],
    [24.182908101602127, 120.61111539602281],
    [24.18297661267481, 120.61118245124818],
    [24.182991293614158, 120.61132192611696],
    [24.18296193173375, 120.61147212982179],
    [24.182800441270754, 120.61220705509187],
  ];

  return (
    <Polyline positions={path} color="blue" weight={5} opacity={0.8}>
      <Tooltip>公車往管理學院（M）路線</Tooltip>
    </Polyline>
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
        <LayersControl>
          <LayersControl.Overlay checked name="公車往社會科學院（SS）路線">
            <BusDriveToCollegeOfSocialSciences />
          </LayersControl.Overlay>
          <LayersControl.Overlay checked name="公車往管理學院（M）路線">
            <BusDriveToCollegeOfManagement />
          </LayersControl.Overlay>
        </LayersControl>
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
        {process.env.NODE_ENV === "development" ? (
          <PolylineDraw />
        ) : (
          <LocationMarker />
        )}
      </MapContainer>
    </div>
  );
}
