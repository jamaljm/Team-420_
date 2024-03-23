"use client";

import React, { useEffect } from "react";

import Map from "./Map";

import { useState } from "react";
import Link from "next/link";
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
  order_price: any;
  coordinates: { lat: any; lng: any };
  items: any;
  key: string;
  unique_id: string;
  order_tittle: string;
  streamSid: string;
  name: string;
  order_quantity: any;
  location?: string;
  geocode?: Geocode;
  phone_no: string;
  live: boolean;
  status: StatusesKeys;
  transcript?: string;
  dateCreated: string;
  dateDisconnected?: string;
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
    console.log(values);
    
    useEffect 

  const filteredCalls: CallData[] = (values || [])
    .filter((call: any) => call.status === ("ordered" as StatusesKeys))
    .map((call: any) => ({ ...call, key: call.unique_id }));

  const filteredCalls2: CallData[] = (values || [])
    .filter((call: any) => call.status === ("accepted" as StatusesKeys))
    .map((call: any) => ({ ...call, key: call.unique_id }));

  const filteredCalls3: CallData[] = (values || [])
    .filter((call: any) => call.status === ("delivered" as StatusesKeys))
    .map((call: any) => ({ ...call, key: call.unique_id }));

  console.log(values);

  const handleAccept = (unique_id: string) => {};

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
      <div className=" flex min-h-screen items-start w-full">
        <div
          className="flex w-full -mt-3 items-start flex-col sm:w-64  rounded-3xl"
          style={{ flex: 3 }}
        >
          <div className="px-2 pr-4">
            <div className="py-1 bg-[#121826] sm:py-1 lg:py-2 rounded-xl">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex flex-col ">
                  <div className="-mx-4 -my-1 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="grid grid-cols-8 w-full gap-x-3.5">
                        <div className="py-3.5 pl-4 pr-3 text-left text-sm whitespace-nowrap font-medium  text-white">
                          <div className="flex items-center">ID</div>
                        </div>

                        <div className="py-3.5 px-3 text-left col-span-3 text-sm whitespace-nowrap font-medium font-body1 text-white">
                          <div className="flex items-center">Location</div>
                        </div>
                        <div className="py-3.5 px-3 text-left col-span-2 text-sm whitespace-nowrap font-medium font-body1 text-white">
                          <div className="flex items-center">Mobile No</div>
                        </div>

                        <div className="py-3.5 px-3 text-left text-sm whitespace-nowrap font-medium font-body1 text-white">
                          <div className="flex items-center">Need</div>
                        </div>

                        <div className="py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0">
                          <span className="sr-only">Actions</span>
                        </div>
                      </div>
                      {filteredCalls.map((call, index) => (
                        <div>
                          <div className="divide-y divide-red-200">
                            <div
                              className="grid grid-cols-8 gap-x-3.5"
                              key={call.key}
                            >
                              <div className="py-4 pl-4 pr-3 font-body1 text-sm font-medium text-gray-900 whitespace-nowrap">
                                {index + 1}
                              </div>

                              <div className="px-4 font-body1 py-4 col-span-3 text-sm font-semibold text-gray-900 whitespace-nowrap">
                                {call.location}
                              </div>
                              <div className="px-4 col-span-2 font-body1 py-4 text-sm font-bold text-gray-900 whitespace-nowrap">
                                <a href={`tel:${call.phone_no}`}>
                                  <img
                                    className="inline-block mr-2 "
                                    width="30"
                                    height="30"
                                    src="https://img.icons8.com/color/48/apple-phone.png"
                                    alt="apple-phone"
                                  />
                                  {call.phone_no}
                                </a>
                              </div>
                              <div className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                <div className="inline-flex font-body1 items-center">
                                  <svg
                                    className="mr-1.5 h-2.5 w-2.5 text-red-500"
                                    fill="currentColor"
                                    viewBox="0 0 8 8"
                                  >
                                    <circle cx="4" cy="4" r="3" />
                                  </svg>
                                  {call.status}
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
                            <div className="py-1 mb-5 bg-white grid  grid-cols-6">
                              <div className="py-12 col-span-4 bg-white sm:py-16 lg:py-2">
                                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-3">
                                  <div>
                                    <p className="text-md font-medium text-white">
                                      Latest Transactions
                                    </p>
                                  </div>

                                  <div className="mt-6 ring-1 ring-red-300 rounded-2xl">
                                    <table className="min-w-full lg:divide-y lg:divide-red-200">
                                      <thead className="hidden lg:table-header-group">
                                        <tr>
                                          <td
                                            width="50%"
                                            className="px-6 py-4 text-sm font-medium text-red-400 whitespace-normal"
                                          >
                                            item
                                          </td>
                                          <td
                                            width="50%"
                                            className="px-6 py-4 text-sm font-medium text-red-400 whitespace-normal"
                                          >
                                            price
                                          </td>

                                          <td className="px-6 py-4 text-sm font-medium text-red-400 whitespace-normal">
                                            Quantity
                                          </td>
                                        </tr>
                                      </thead>

                                      <tbody className="divide-y divide-red-200">
                                        <tr>
                                          <td className="px-6 py-4 font-body1 text-sm font-normal text-white whitespace-nowrap">
                                            {call.order_tittle}
                                          </td>
                                          <td className="px-6 font-body1 py-4 text-sm font-normal text-white whitespace-nowrap">
                                            ₹ {call.order_price}
                                          </td>
                                          <td className="px-6 py-4 font-body1 text-sm font-normal text-white whitespace-nowrap">
                                            {call.order_quantity}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="px-6 font-body1 py-4 text-sm font-bold text-white whitespace-nowrap">
                                            Total price{" "}
                                          </td>

                                          <td className="hidden px-6 py-4 text-sm font-body1 font-bold text-white lg:table-cell whitespace-nowrap">
                                            ₹ {call.order_price}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div className="py-12 col-span-1 bg-white sm:py-16 lg:py-2">
                                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-3">
                                  <div>
                                    <p className="text-md font-medium text-white">
                                      Action{" "}
                                    </p>
                                  </div>

                                  <div className="mt-6  rounded-2xl">
                                    <button
                                      onClick={() =>
                                        handleAccept(call.unique_id)
                                      }
                                      className="bg-green-400 text-white px-9 py-2 rounded-2xl "
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleCancel(call.unique_id)
                                      }
                                      className="bg-red-400 mt-2 text-white px-9 py-2 rounded-2xl "
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {showOrderDetails && selectedOrderIndex === index && (
                            //  map
                            <div className=" mb-8 relative w-full rounded-3xl h-80">
                              {/* <Map
                                lat={call.coordinates.lat}
                                lng={call.coordinates.lng}
                              /> */}
                            </div>
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
