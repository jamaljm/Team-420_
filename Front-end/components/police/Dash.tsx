import React from "react";
import Map from "./Map";

export default function Dash() {
  return (
    <div className="bg-[#212936] w-full border-t-2  border-red-200   min-h-screen flex justify-center rounded-t-3xl -mt-2 pt-4 items-center">
      <div className="w-[70%] px-5  min-h-screen">
        <div className="mt-3 "></div>
        <div className="relative min-h-screen  h-full w-full flex m-0 p-0 shadow-md rounded-2xl">
          <Map />
        </div>
      </div>
      <div className="w-[30%] h min-h-screen"></div>
    </div>
  );
}
