import React from "react";
import Map from "./Map";

export default function Dash() {
  return (
    <div className="bg-white w-full border-t-2  border-green-200   min-h-screen flex justify-center rounded-t-3xl -mt-2 pt-4 items-center">
      <div className="flex-1  w-full min-h-screen">
        <div className="relative -mt-16 h-full w-full flex m-0 p-0 shadow-md rounded-2xl">
          <Map />
        </div>
      </div>
      <div className="flex-1  w-full h min-h-screen "></div>
    </div>
  );
}
