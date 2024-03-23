import React from "react";
import Map from "./Map";
import Statics from "./Statics";
import Table from "./Table";

export default function Dash() {
  return (
    <div className="bg-[#212936] w-full border-t-2  border-red-200   min-h-screen flex justify-center rounded-t-3xl -mt-2 pt-4 items-center">
      <div className="flex-1 px-5 w-full min-h-screen">
        <div className="mt-3 ">
          <Statics />
        </div>
        <div className="relative min-h-screen items-start -mt-10 h-full w-full flex m-0 p-0 shadow-md rounded-2xl">
          <Map />
        </div>
      </div>
      <div className="flex-1  w-full rounded-xl h min-h-screen ">
        <Table />
      </div>
    </div>
  );
}
