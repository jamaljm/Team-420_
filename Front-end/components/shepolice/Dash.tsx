import React from "react";
import Map from "./Map";

export default function Dash() {
  const policeData = [
    { name: "Police Station 1", location: "Location 1", contact: "1234567890" },
    { name: "Police Station 2", location: "Location 2", contact: "9876543210" },
    { name: "Police Station 3", location: "Location 3", contact: "5678901234" },
    { name: "Police Station 4", location: "Location 4", contact: "5672901234" },
  ];

  return (
    <div className="bg-[#212936] w-full border-t-2 border-red-200 min-h-screen flex justify-center rounded-t-3xl -mt-2 pt-4 items-center">
      <div className="w-[70%] px-5 min-h-screen">
        <div className="mt-3 "></div>
        <div className="relative min-h-screen items-start h-full w-full flex m-0 p-0 shadow-md rounded-2xl">
          <Map />{" "}
        </div>
      </div>
      <div className="w-[30%] h min-h-screen">
        <div className="grid px-4 grid-cols-2 text-center xl:text-left mt-3 gap-y-8 gap-x-6 sm:grid-cols-1 xl:grid-cols-1">
          {/* Rendering PoliceCard for each data */}
          {policeData.map((police, index) => (
            <PoliceCard
              key={index}
              name={police.name}
              location={police.location}
              contact={police.contact}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PoliceCardProps {
  name: string;
  location: string;
  contact: string;
}

export function PoliceCard({ name, location, contact }: PoliceCardProps) {
  return (
    <div className="flex gap-3 bg-[#334056] rounded-2xl">
      <img
        className="object-cover w-auto h-24 mx-auto rounded-lg md:h-36 xl:mx-0"
        src="https://png.pngtree.com/png-vector/20240129/ourlarge/pngtree-police-car-isolated-on-a-white-background-png-image_11583370.png"
        alt=""
      />
      <div className="flex flex-col">
        <p className="mt-5 text-base font-bold text-gray-100">{name}</p>
        <p className="mt-1 text-sm font-medium font-body4 text-gray-100">
          Location: {location}
        </p>
        <p className="mt-1 text-sm font-medium font-body4 text-gray-100">
          Contact: {contact}
        </p>
        <button className="mt-3 px-4 py-1 w-full font-body4 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Contact
        </button>
      </div>
    </div>
  );
}
