"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@nextui-org/button";

import { useEffect } from "react";

export default function Navbar() {
  return (
    <header>
      <div className="bg-[#2f3b4d] pt-1.5 pb-2">
        <div className="px-4 mx-auto sm:px-6 lg:px-16">
          <nav className="relative flex items-center justify-center h-16 lg:h-16">
            <div className="hidden  lg:flex font-body4 lg:items-center gap-7">
              <Link
                href="#"
                className="text-sm flex gap-2 text-white px-4 font-medium bg-red-500 rounded-full py-1.5 "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="#ffffff"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                Home
              </Link>

              <Link
                href="#"
                title=""
                className="text-sm flex gap-2 text-white px-4 font-medium bg-red-500 rounded-full py-1.5 "
              >
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/police-car.png"
                  alt="police-car"
                />
                Police
              </Link>
              <Link
                href="#"
                title=""
                className="text-sm flex gap-2 text-white px-4 font-medium bg-red-500 rounded-full py-1.5 "
              >
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/ambulance--v1.png"
                  alt="ambulance--v1"
                />
                Ambulance
              </Link>
              <Link
                href="#"
                title=""
                className="text-sm flex gap-2 text-white px-4 font-medium bg-red-500 rounded-full py-1.5 "
              >
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/ios-filled/50/FFFFFF/fire-truck.png"
                  alt="fire-truck"
                />
                Fireforce
              </Link>
              <Link
                href="#"
                title=""
                className="text-sm flex gap-2 text-white px-4 font-medium bg-red-500 rounded-full py-1.5 "
              >
                <img
                  width="20"
                  height="20"
                  src="https://img.icons8.com/emoji/48/woman-police-officer.png"
                  alt="woman-police-officer"
                />
                ShePolice
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
