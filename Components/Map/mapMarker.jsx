import React from "react";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import assest from "@/json/assest";

export default function MapMarker({ allServiceSearchList }) {

  const customMarker = new L.icon({
    iconUrl: assest.marker3,
    iconSize: [21, 29],
    iconAnchor: [5, 21],
    popupAnchor: [1, -20],
  });
//   iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",

  return (
    <div>
      {allServiceSearchList?.data?.map((item, i) => {
        return item?.service_info?.map((items) => {
    
          return (
            <>
              <Marker
                position={[Number(items.latitude), Number(items.longitude)]}
                icon={customMarker}
              >
                <Popup>Name:{items.title}<br/>
                 Price:{items.price}
                </Popup>
              </Marker>
            </>
          );
        });
      })}
    </div>
  );
}
