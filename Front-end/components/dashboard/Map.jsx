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
      {/* <h3 className=" font-sans text-lg ">{data.tittle.toUpperCase()}</h3>
      <p className="font-sans text-sm">{data.description}</p> */}
    </div>
  );
}

function Map() {
  const [markerData, setmarkerData] = useState([{}]);
  const [Location, setLocation] = useState([]);
  const [corods, setcorods] = useState([]);

  useEffect(() => {
    const fetchLocation = async () => {
      const { data, error } = await supabase.from("police").select("*");
      if (error) console.log("error", error);
      console.log(data);
      setmarkerData(data);
      setLocation(
        data.filter((person) => person !== "").map((person) => person)
      );
    };
    fetchLocation();
  }, []);
  console.log(markerData);
  const fetchPost = async () => {
    supabase
      .channel("police")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "police" },
        (payload) => {
          console.log("Change received!", payload);
        }
      )
      .subscribe();
    // setLocation(
    //   newData
    //     .filter((person) => person.location !== "")
    //     .map((person) => person.location)
    // );
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
  console.log(corods);

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
        zoom: 8,
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
      const markers = markerData.map((obj) => {
        el = document.createElement("div");
        el.className = "marker";
        if (obj.station_longitude) {
          return new mapboxgl.Marker(el)
            .setLngLat([obj.station_longitude, obj.station_latitude])
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
  }, [corods]);

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
