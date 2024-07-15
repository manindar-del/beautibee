import React, { useEffect, useState, useRef } from "react";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import MapMarker from "../Map/mapMarker";
import { Box } from "@mui/material";

const customMarker = new L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
  iconSize: [15, 25],
  iconAnchor: [5, 21],
  popupAnchor: [1, -20],
});



const MapForSearch = ({
  getCurrentLocation,
  lat = 51.505,
  long = -0.09,
  allServiceSearchList,
  numberData = 1 ,
}) => {
  //const position = [51.505, -0.09];
  const Defaultbounds = new L.LatLngBounds(
    [29.7453016622136, -126.65039062500001],
    [38.805470223177466, -111.48925781250001]
  );
  const MAP_MIN_ZOOM = 7;

  const [position, setPosition] = useState(null);
  

 

  const [bounds, setBounds] = useState(Defaultbounds);

  const [zoom, setZoom] = useState(MAP_MIN_ZOOM);

  function RefreshMapView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);

    return null;
  }

 // console.log(getCurrentLocation,"getCurrentLocation");

  
  // location
  function LocationMarker() {

    //Add
    // const [position, setPosition] = useState(null);
    // const [bbox, setBbox] = useState([]);

    const map = useMap();

    // useEffect(() => {
    //   map.locate().on("locationfound", function (e) {
    //     setPosition(e.latlng);
    //     map.flyTo(e.latlng, map.getZoom());
    //     const radius = e.accuracy;
    //     const circle = L.circle(e.latlng, radius);
    //     circle.addTo(map);
    //     setBbox(e.bounds.toBBoxString().split(","));
    //   });
    // }, [map]);

     // End Add

    const HandleLocation = () => {
      map.locate().on("locationfound", (e) => {
        map.flyTo(e.latlng, map.getZoom());
        const radius = e.accuracy;
        const circle = L.circle(e.latlng, radius);
        circle.addTo(map);
      });
    };

  
    return (
      <IconButton
        onClick={HandleLocation}
        variant="contained"
        style={{
          zIndex: 999,
          background: "white",
          padding: 3,
        }}
      >
        <MyLocationIcon sx={{ color: "grey" }} />
      </IconButton>
    );
  }

   // location

   




 
  function GetCoordinates() {
    const map = useMapEvents({
      dragend: (e) => {
        console.log("mapCenter", e.target.getBounds());
        setBounds(e.target.getBounds());
        setZoom(e.target.getZoom());
        // console.log("map bounds", e.target.getBounds());
      },
      zoomend: (e) => {
        //console.log("zoom ", e.target.getCenter());
        setBounds(e.target.getBounds());
        setZoom(e.target.getZoom());
      },
    });
    return null;
  }

  const mapRef = useRef(null);

  // const handleSelectChangeType = (e) => {
  //   setDistanceTypes(e.target.value);
  // };

  // const demoPosition = [
  //   {
  //     lat: 51.38747693112512,
  //     lng: -0.1107412019464804,
  //     name: "demo 1",
  //   },
  //   {
  //     lat: 51.596108091543414,
  //     lng: 0.00816064245638959,
  //     name: "demo 2",
  //   },
  //   {
  //     lat: 51.385762893414956,
  //     lng: 0.11171670540870872,
  //     name: "demo 3",
  //   },
  //   {
  //     lat: 56.17667043238914,
  //     lng: -4.477379828607061,
  //     name: "demo 4",
  //   },
  //   {
  //     lat: 19.22298993058183,
  //     lng: 78.82851230524079,
  //     name: "demo 5",
  //   },
  //   {
  //     lat: 51.50975743908446,
  //     lng: -0.0892632676251637,
  //     name: "demo 6",
  //   },
  //   {
  //     lat: 22.57762385840401,
  //     lng: 88.42789241680006,
  //     name: "demo 7",
  //   },
  // ];
  //const map = useMap();

  

  // useEffect(() => {
  //   map.locate().on("locationfound", (e) => {
  //     setPosition(e.latlng);
  //     map.flyTo(e.latlng, map.getZoom());
  //   });
  // }, []);


  
  //console.log(numberData,"numberData")


  
  return (
    <>
      {getCurrentLocation !== undefined ? (
        <MapContainer
          //center={[lat, long]}
           center={[getCurrentLocation[0], getCurrentLocation[1] ]}
          zoom={13}
          // ref={mapRef}
          scrollWheelZoom={true}
          style={{ height: numberData ? "100%" : "500px",position:'relative', marginBottom: "41px" }}
         
        >
          {/* <RefreshMapView center={getCurrentLocation} zoom={13} />  */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GetCoordinates />

          <MapMarker allServiceSearchList={allServiceSearchList} />

          <Tooltip placement="left" title="My location">
            <Box sx={{
              position:'absolute',
              left:'5px',top:0
            }}>
                <LocationMarker />
            </Box>
          
          </Tooltip>

          {/* <RefreshMapView lat={getCurrentLocation[0]} lng={getCurrentLocation[1]} /> */}
        </MapContainer>
      ) : (
        "loading..."
      )}
    </>
  );
};

export default MapForSearch;
