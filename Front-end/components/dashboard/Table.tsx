"use client";

import React, { useEffect } from "react";

import Map from "./Map";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/config/supabase/client";
import { Button } from "@nextui-org/react";
// import MapN from "./Small_map";
type StatusesKeys = "open" | string;

interface MarkerData {
  id: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Geocode {
  lat: number;
  lng: number;
}

export type CallData = {
  id: number;
  created_at: string;
  user_name: string;
  user_phone: number;
  user_lat: number;
  user_lon: number;
  driver_name: string;
  driver_phone: number;
  driver_location: {
    [key: string]: string;
  };
  p_vechicle_number: string;
  police_phone: number | null;
  police_location: {
    [key: string]: string;
  };
  fire_vechicle_number: string | null;
  fire_phone: number | null;
  fire_location: {
    [key: string]: string;
  };
  she_vechicle_number: string | null;
  she_location: {
    [key: string]: string;
  };
  she_phone: number | null;
  emergency_desc: {
    type: string;
    description: string;
    no_of_people: number;
  };
  flags: {
    police: boolean;
    she_help: boolean;
    ambulance: boolean;
    fireforce: boolean;
  };
};

const containerStyle = {
  height: "400px",
  width: "100%",
  borderRadius: "10px",
};

const center = {
  lat: 10.0261,
  lng: 76.3125,
};

export default function Dashboard() {
  const [values, setValues] = useState<CallData[]>([]);
  const [selectedOrderIndex, setSelectedOrderIndex] = useState(1);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("main_table")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching data:", error);
        return;
      }
      setValues(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    supabase
      .channel("main_table")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "main_table",
        },
        (payload) => {
          console.log("Change received!", payload);
          if (payload) {
                    setValues((prev) => [payload.new as CallData, ...prev]);
          }
        }
      )
      .subscribe();
  }, []);

  const filteredCalls: CallData[] = (values || [])
    .filter((call: any) => call.status === ("get" as StatusesKeys))
    .map((call: any) => ({ ...call, key: call.unique_id }));

  const filteredCalls2: CallData[] = (values || [])
    .filter((call: any) => call.status === ("accepted" as StatusesKeys))
    .map((call: any) => ({ ...call, key: call.unique_id }));

  const handleAccept = (unique_id: string) => {
    const updatedCalls = values.map(async (call) => {
      if (call.id.toString() === unique_id) {
        const { data, error } = await supabase
          .from("main_table")
          .update({ common_status: true })
          .eq("id", unique_id);
      }
    });
    return "true";
  };

  const handleCancel = (unique_id: string) => {};

  const [infoWindowData, setInfoWindowData] = React.useState<MarkerData | null>(
    null
  );
  const [isOpen, setIsOpen] = React.useState(false);

  const handleMarkerClick = (marker: MarkerData) => {
    setInfoWindowData(marker);
    setIsOpen(true);
  };
  return (
    <>
      <div className=" flex h-full items-start w-full">
        <div
          className="flex w-full -mt-3 items-start flex-col sm:w-64  rounded-3xl"
          style={{ flex: 3 }}
        >
          <div className="px-2 pr-4">
            <div className="py-1 bg-[#121826] min-h-screen sm:py-1 lg:py-2 rounded-xl">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex flex-col ">
                  <div className="-mx-4 -my-1 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="grid grid-cols-8 w-full gap-x-3.5">
                        <div className="py-3.5 pl-4 pr-3 col-span-1 text-left text-sm whitespace-nowrap font-medium  text-white">
                          <div className="flex items-center">ID</div>
                        </div>

                        <div className="py-3.5 px-3 text-left col-span-2 text-sm whitespace-nowrap font-medium font-body1 text-white">
                          <div className="flex items-center">Name</div>
                        </div>
                        <div className="py-3.5 px-3 text-left col-span-2 text-sm whitespace-nowrap font-medium font-body1 text-white">
                          <div className="flex items-center">Mobile No</div>
                        </div>

                        <div className="py-3.5 px-3 col-span-2 text-left text-sm  whitespace-nowrap font-medium font-body1 text-white">
                          <div className="flex items-center">Emergency</div>
                        </div>

                        <div className="py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                          <span className="sr-only">Actions</span>
                        </div>
                      </div>
                      {values.map((call, index) => (
                        <div>
                          <div className="divide-y divide-red-200">
                            <div
                              className="grid grid-cols-8 gap-x-3.5"
                              key={index}
                            >
                              <div className="py-4 pl-4 pr-3 font-body1 text-sm font-medium text-white whitespace-nowrap">
                                {call.id}
                              </div>

                              <div className="px-4 font-body1 py-4 col-span-2 text-sm font-medium text-white whitespace-nowrap">
                                {call.user_name}
                              </div>
                              <div className="px-4 col-span-2 font-body1 py-4 text-sm font-medium text-white whitespace-nowrap">
                                <a href={`tel:${call.user_phone}`}>
                                  <img
                                    className="inline-block mr-2 "
                                    width="25"
                                    height="25"
                                    src="https://img.icons8.com/color/48/apple-phone.png"
                                    alt="apple-phone"
                                  />
                                  {call.user_phone}
                                </a>
                              </div>
                              <div className="px-4 py-4 text-sm col-span-2 font-medium text-white whitespace-nowrap">
                                <div className="inline-flex font-body1 items-center">
                                  {call.emergency_desc?.type}
                                </div>
                              </div>
                              <div className="px-4 py-4 text-sm font-medium text-right text-white whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedOrderIndex(index);
                                    setShowOrderDetails(!showOrderDetails);
                                  }}
                                  className="inline-flex items-center justify-center w-8 h-8 text-red-400 transition-all duration-200 bg-white rounded-full hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
                                >
                                  <img
                                    className={`transform transition-transform ${
                                      showOrderDetails &&
                                      index === selectedOrderIndex
                                        ? ""
                                        : "rotate-180"
                                    }`}
                                    width="20"
                                    height="20"
                                    src="https://img.icons8.com/ios/50/collapse-arrow--v2.png"
                                    alt="collapse-arrow--v2"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>
                          {showOrderDetails && selectedOrderIndex === index && (
                            <div className="py-1 mb-5 bg-[#121826] grid  grid-cols-6">
                              <div className="py-12 col-span-6 bg-[#121826] sm:py-16 lg:py-2">
                                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-3">
                                  <div>
                                    <p className="text-md font-medium text-white">
                                      Emergency
                                    </p>
                                    <p className="text-xs bg-[#232d479e] px-3 my-2 rounded-xl text-white font-body1 py-3">
                                      {call.emergency_desc?.description}
                                    </p>
                                    <p className="text-xs bg-red-200  px-4 py-1 rounded-2xl w-fit font-body4  font-normal text-black">
                                      No of People involved:{" "}
                                      {call.emergency_desc?.no_of_people}
                                    </p>
                                  </div>

                                  <div className="mt-6 ring-1 ring-red-300 rounded-2xl">
                                    <table className="min-w-full lg:divide-y lg:divide-red-200">
                                      <thead className="hidden lg:table-header-group">
                                        <tr>
                                          <td
                                            width="50%"
                                            className="px-6 py-3 text-xs font-body1  font-medium text-red-400 whitespace-normal"
                                          >
                                            Emergency needed
                                          </td>
                                          <td
                                            width="50%"
                                            className="px-6 py-3 text-xs font-body1  font-medium text-red-400 whitespace-normal"
                                          >
                                            Status{" "}
                                          </td>
                                          <td
                                            width="50%"
                                            className="px-6 py-3 text-xs font-body1  font-medium text-red-400 whitespace-normal"
                                          >
                                            Name/No
                                          </td>

                                          <td className="px-6 py-3 text-xs font-body1  font-medium text-red-400 whitespace-normal">
                                            Contact
                                          </td>
                                        </tr>
                                      </thead>

                                      <tbody className="divide-y divide-red-200">
                                        {call.flags.police && (
                                          <tr>
                                            <td className="px-6 font-body1 py-3 text-xs  font-normal text-white whitespace-nowrap">
                                              Police
                                            </td>
                                            <td
                                              className={`px-2 font-body1  py-3 text-sm font-medium text-gray-700 whitespace-nowrap ${
                                                call.p_vechicle_number
                                                  ? "bg-green-200"
                                                  : "bg-red-200"
                                              }`}
                                            >
                                              {call.p_vechicle_number
                                                ? "Assigned"
                                                : "Not Assigned"}
                                            </td>
                                            <td className="px-6 font-body1 py-3 text-xs  font-normal text-white whitespace-nowrap">
                                              {call.p_vechicle_number}
                                            </td>{" "}
                                            <td className="px-6 font-body1 py-3 text-xs  font-normal text-white whitespace-nowrap">
                                              {call.p_vechicle_number}
                                            </td>
                                          </tr>
                                        )}
                                        {call.flags.fireforce && (
                                          <tr>
                                            <td className="px-6 py-3 font-body1 text-xs  font-normal text-white whitespace-nowrap">
                                              Fire Force
                                            </td>
                                            <td
                                              className={`px-2 font-body1  py-3 text-sm font-medium text-gray-700 whitespace-nowrap ${
                                                call.fire_vechicle_number
                                                  ? "bg-green-200"
                                                  : "bg-red-200"
                                              }`}
                                            >
                                              {call.fire_vechicle_number
                                                ? "Assigned"
                                                : "Not Assigned"}
                                            </td>
                                            <td className="px-6 font-body1 py-3 text-xs  font-normal text-white whitespace-nowrap">
                                              {call.fire_vechicle_number}
                                            </td>{" "}
                                            <td className="px-6 font-body1 py-3 text-xs  font-normal text-white whitespace-nowrap">
                                              {call.fire_phone}
                                            </td>
                                          </tr>
                                        )}
                                        {call.flags.she_help && (
                                          <tr>
                                            <td className="px-6 font-body1 py-3 text-xs  font-normal text-white whitespace-nowrap">
                                              She-Police
                                            </td>
                                            <td
                                              className={`px-2 font-body1  py-3 text-sm font-medium text-gray-700 whitespace-nowrap ${
                                                call.she_vechicle_number
                                                  ? "bg-green-200"
                                                  : "bg-red-200"
                                              }`}
                                            >
                                              {call.she_vechicle_number
                                                ? "Assigned"
                                                : "Not Assigned"}
                                            </td>
                                            <td className="px-6 font-body1 py-3 text-xs  font-normal text-white whitespace-nowrap">
                                              {call.she_vechicle_number}
                                            </td>{" "}
                                            <td className="px-6 font-body1 py-3 text-xs  font-normal text-white whitespace-nowrap">
                                              {call.she_phone}
                                            </td>
                                          </tr>
                                        )}
                                        {call.flags.ambulance && (
                                          <tr>
                                            <td className="px-6 py-3 font-body1 text-xs  font-normal text-white whitespace-nowrap">
                                              Ambulance
                                            </td>
                                            <td
                                              className={`px-2 font-body1  py-3 text-sm font-medium text-gray-700 whitespace-nowrap ${
                                                call.driver_name
                                                  ? "bg-green-200"
                                                  : "bg-red-200"
                                              }`}
                                            >
                                              {call.driver_name
                                                ? "Assigned"
                                                : "Not Assigned"}
                                            </td>
                                            <td className="px-6 py-3 font-body1 text-xs  font-bold text-white whitespace-nowrap">
                                              {call.driver_name}
                                            </td>
                                            <td className="px-6 font-body1 py-3 text-xs  font-normal text-white whitespace-nowrap">
                                              {call.driver_phone}
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>{" "}
                                <Button
                                  onClick={() =>
                                    handleAccept(call.id.toString())
                                  }
                                  className="bg-green-200 mt-4 mx-4 py-0.5 w-[96%] text-green-950  font-body4 font-semibold"
                                >
                                  Resolved
                                </Button>
                              </div>
                            </div>
                          )}
                          {showOrderDetails && selectedOrderIndex === index && (
                            <></>
                            //  map
                            // <div className=" mb-8 relative w-full rounded-3xl h-80">
                            //   <MapN lat={call.user_lat} lng={call.user_lon} />
                            // </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
