"use client";
import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import ReactDOMServer from "react-dom/server";
import { supabase } from "../../config/supabase/client";

// import './App.css';
// import MapMarker from './Marker';

mapboxgl.accessToken =
  "pk.eyJ1IjoiYWxhcGFub3NraSIsImEiOiJjbGVxMjhjbmowaTZpNDVvNWQ4NTBsc2JtIn0.LFIPoIEmYQJv5bfRPueMQQ";

function PopupComponent({ data }) {
  return (
    <div className="popup flex-col items-center">
      <p className=" text-xs font-body4">{data.name}</p>
      <p className=" text-xs font-body4">{data.phoneNumber}</p>
    </div>
  );
}
const fireForceData = [
  {
    name: "Thiruvananthapuram Fire Station A",
    phoneNumber: "1234567890",
    latitude: 8.5074,
    longitude: 76.9587, // Approximate coordinates within 20 km radius of Thiruvananthapuram
  },
  {
    name: "Thiruvananthapuram Fire Station B",
    phoneNumber: "2345678901",
    latitude: 8.4786,
    longitude: 76.9524, // Approximate coordinates within 20 km radius of Thiruvananthapuram
  },
  {
    name: "Thiruvananthapuram Fire Station C",
    phoneNumber: "3456789012",
    latitude: 8.4914,
    longitude: 76.9487, // Approximate coordinates within 20 km radius of Thiruvananthapuram
  },
  {
    name: "Thiruvananthapuram Fire Station D",
    phoneNumber: "4567890123",
    latitude: 8.5152,
    longitude: 76.9759, // Approximate coordinates within 20 km radius of Thiruvananthapuram
  },
  {
    name: "Thiruvananthapuram Fire Station E",
    phoneNumber: "5678901234",
    latitude: 8.4865,
    longitude: 76.9543, // Approximate coordinates within 20 km radius of Thiruvananthapuram
  },
];



function Map() {
  const [markerData, setmarkerData] = useState([{}]);
  const [Location, setLocation] = useState([]);
  const [corods, setcorods] = useState([]);
  const [chumma, setchumma] = useState(23);

  useEffect(() => {
    const fetchLocation = async () => {
      const { data, error } = await supabase.from("main_table").select("*");
      if (error) console.log("error", error);
      console.log(data);
      setmarkerData(data);
    };
    fetchLocation();
  }, []);
  console.log(markerData);
  const fetchPost = async () => {
    supabase
      .channel("main_table")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "main_table",
        },
        (payload) => {
          console.log("Change received!", payload);
          if (payload) {
            setmarkerData((prevData) => [...prevData, payload.new]);
          }
        }
      )
      .subscribe();
  };

  useEffect(() => {
    fetchPost();
  }, []);
  let cordinaates = [
    [76.3289828, 10.0298734],
    [76.357, 10.1004],
    [76.3125, 10.0261],
  ];

  useEffect(() => {
    setcorods(
      cordinaates.map((item) => [
        item?.station_longitude,
        item?.station_latitude,
      ])
    );
  }, [Location]);

  let longitude, latitude;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        (latitude = position.coords.latitude),
          (longitude = position.coords.longitude);
        // console.log(latitude,longitude)
      },
      (error) => {
        console.log(error);
      }
    );
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
  // console.log(latitude,longitude)

  function saveLocationData() {}

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/dark-v11",
        attributionControl: false,
        // style:'mapbox://styles/mapbox/dark-v11',
        center: [position.coords.longitude, position.coords.latitude],
        zoom: 12,
      });

      map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        "bottom-right"
      );

      let el = document.createElement("div");
      const markers = fireForceData.map((obj) => {
        el = document.createElement("div");
        el.className = "marker3";
        console.log(obj);
        if (typeof obj.latitude === "number") {
          console.log(typeof obj.latitude, obj.longitude);

          return new mapboxgl.Marker(el)
            .setLngLat([obj.longitude, obj.latitude])
            .setPopup(
              new mapboxgl.Popup({ closeOnClick: false }).setHTML(
                ReactDOMServer.renderToString(
                  <PopupComponent data={obj} key={obj.id} />
                )
              )
            )
            .addTo(map);
        }
      });
    });
  }, [markerData]);

  return (
    <>
      <div
        id="map"
        className="absolute inset-0 m-0 overflow-hidden z-100 shadow-md  rounded-1xl "
      ></div>
    </>
  );
}

export default Map;
