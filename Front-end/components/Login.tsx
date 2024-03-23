"use client";

import React, { useState } from "react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  const handleLoging = async (e: any) => {
    router.push("/dashboard");
  };
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
        <div className="relative flex items-end rounded-full px-4 pb-10 pt-60 sm:pb-16 md:justify-center lg:pb-24 bg-red-50 sm:px-6 lg:px-8">
          <div className="absolute inset-0 rounded-full">
            <img
              className="object-cover w-full h-full  rounded-r-xl"
              src="/login.jpg"
            ></img>
          </div>

          <div className="relative flex justify-center items-center "></div>
        </div>

        <div className="flex font-body4 items-center justify-center px-4 py-10  bg-white sm:px-6 lg:px-8 sm:py-16 lg:py-24">
          <div className="xl:w-full xl:max-w-sm 2xl:max-w-md xl:mx-auto">
            <h2 className="text-3xl font-body font-clash-display-600 font- leading-tight text-red-700 sm:text-4xl">
Admin Dashboard            </h2>
<p className="bg-red-100 mt-2 text-red-800 border border-red-500 text-sm  px-4 py-0.5 w-fit rounded-full">Police _ Ambulance _ Fireforce</p>
            <form method="POST" className="mt-8">
              <div className="space-y-5">
                <div>
                  <label className="text-base font-medium text-red-900">
                    {" "}
                    Email address{" "}
                  </label>
                  <div className="mt-2.5 relative text-red-400 focus-within:text-red-600">
                    <input
                      type="email"
                      name=""
                      required
                      placeholder="Enter email to get started"
                      className="block w-full py-4 pl-4 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-full bg-white focus:outline-none focus:border-red-600 focus:bg-white caret-red-600"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-base font-medium text-red-900">
                      {" "}
                      Password{" "}
                    </label>
                  </div>
                  <div className="mt-2.5 relative text-red-400 focus-within:text-red-600">
                    <input
                      type="password"
                      name=""
                      placeholder="Enter your password"
                      className="block w-full py-4 pl-4 pr-4 text-black placeholder-gray-500 transition-all duration-200 border border-gray-200 rounded-full bg-white focus:outline-none focus:border-red-600 focus:bg-white caret-red-600"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    onClick={handleLoging}
                    className="inline-flex items-center border-red-900 justify-center w-full px-4 py-3 text-base font-semibold text-red-900 transition-all duration-200 border  rounded-full  bg-none focus:outline-none hover:opacity-80 focus:opacity-80"
                  >
                    Log in
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-5 space-y-3">
              <Link
                // type="button"
                href="/dashboard"
                // onClick={handleLoging}
                className="relative inline-flex items-center justify-center w-full px-4 py-3 text-base font-semibold text-red-800 transition-all duration-200 bg-red-50  border border-red-400 rounded-full hover:bg-red-100 focus:bg-red-100 hover:text-white focus:text-white focus:outline-none"             >
                <div className="absolute flex  items-center inset-y-0 left-0 p-4">
                  <svg
                    className="w-6 h-6 text-red"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"></path>
                  </svg>
                </div>
                Login with Google
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
