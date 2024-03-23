"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { JSX, SVGProps, useEffect, useState } from "react";
import { supabase } from "@/config/supabase/client";
import axios from "axios";

// Function to play a beep sound
const playBeep = () => {
  const beep = new Audio("beep.mp3");
  beep.play();
};
const base_url = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Component() {
  const [session, setSession] = useState(null);
  const [markerData, setMarkerData] = useState<any>();
  const [showModal, setShowModal] = useState(false);

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
            playBeep(); // Play beep sound when new data arrives
            const newData = payload.new as any[]; // Replace 'any' with the actual type
            setMarkerData(newData);
            setShowModal(true);
          }
        }
      )
      .subscribe();
  };

  useEffect(() => {
    fetchPost();
  }, [markerData]);

  console.log(markerData);

  const handleAccept = async (id: number) => {
    try {
      // Assuming you have the driver's information available
      const driverName = "34";
      const driverPhone = 2342323434;
      const driverLocation = {
        latitude: 7.8564,
        longitude: 76.8546,
        place: "CET",
      };

      // Update the table data
      const { data, error } = await supabase
        .from("main_table")
        .update({
          she_vechicle_number: driverName,
          she_phone: driverPhone,
          she_location: driverLocation,
        })
        .eq("id", id);

      if (error) {
        throw error;
      }

      const response = await axios.post(base_url, {
        message: "She-police is on the way",
      });
      setShowModal(false);

      console.log("Data updated successfully:", data);
    } catch (error) {
      console.error("Error updating data:");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center h-14 px-4 border-b lg:h-20 xl:px-6">
        <Link
          className="flex items-center gap-2 text-sm font-semibold md:gap-4"
          href="#"
        >
          <FlagIcon className="h-6 w-6 md:h-8 md:w-8" />
          ShePolice
        </Link>
        <div className="ml-auto md:hidden">
          <Button size="sm" variant="ghost">
            Logout
          </Button>
        </div>
        <div className="hidden w-full max-w-md mx-auto md:block">
          <Input
            className="w-full h-8 sm:h-9 md:h-10"
            placeholder="Search"
            type="search"
          />
        </div>
        <Button className="hidden ml-auto md:block" size="sm" variant="ghost">
          Logout
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {showModal && (
          <Card>
            <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 p-4 md:p-6">
              <div className="space-y-1 text-base">
                <h2 className="text-lg font-bold leading-none">
                  Service Request
                </h2>
                <p className="text-sm leading-none text-gray-500 dark:text-gray-400">
                  Name: {markerData.user_name}
                </p>
              </div>
              <div className="space-y-1 text-right ml-auto md:ml-0">
                <p className="text-sm leading-none text-gray-500 dark:text-gray-400">
                  Number: {markerData.user_phone}
                </p>
                <p className="text-sm leading-none text-gray-500 dark:text-gray-400">
                  Location: {markerData.user_lat}, {markerData.user_lng}
                </p>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-4 md:p-6">
              <div className="text-6xl font-semibold">👮🏻‍♀</div>
            </CardContent>
            <CardFooter className="flex gap-2 p-4 md:p-6">
              <Button className="flex-1" variant="outline">
                Decline
              </Button>
              <Button
                className="flex-1"
                onClick={() => handleAccept(markerData.id)}
              >
                Accept
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>
    </div>
  );
}

function FlagIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}
