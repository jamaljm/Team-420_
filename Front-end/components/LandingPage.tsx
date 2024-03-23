import React from "react";

export default function EmergencyReportPage() {
  return (
    <>
      <div className="bg-[#001d32] fixed w-full min-h-screen">
        <header className="py-4 bg-[#ffffff] border-b-2 border-red-500  sm:py-6">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="shrink-0">
                <a
                  href="#"
                  title=""
                  className="flex font-body4 text-3xl font-bold"
                >
                  Beacon AI 🚨
                </a>
              </div>

              <div className="flex md:hidden">
                <button type="button" className="text-white">
                  <span x-show="!expanded" aria-hidden="true">
                    <svg
                      className="w-7 h-7"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </span>

                  <span x-show="expanded" aria-hidden="true">
                    <svg
                      className="w-7 h-7"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <nav className="hidden md:flex md:items-center md:justify-end md:space-x-12">
                <a
                  href="/resolve"
                  title=""
                  className="text-base font-body4 font-normal text-gray-400 transition-all duration-200 hover:text-white"
                >
                  AI Resolution Center
                </a>
              </nav>
            </div>
          </div>
        </header>

        <section className="py-16  bg-[#ffffff] sm:pb-16 lg:pb-20 xl:pb-24">
          <div className="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
            <div className="relative mt-5 flex gap-6">
              <div className="lg:w-2/3 z-50 relative">
                <p className="text-sm font-body4 font-normal tracking-widest text-gray-500 uppercase">
                  AI Report and Resolve Emergencies
                </p>
                <h1 className="mt-6 text-4xl  font-body4 font-normal bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 sm:mt-10 sm:text-5xl lg:text-6xl xl:text-6xl">
                  <span className="text-transparent leading-normal ">
                    Enable AI-powered automatic <br></br> emergency response{" "}
                  </span>{" "}
                </h1>
                <p className="max-w-lg mt-4 text-xl font-body1 font-normal text-gray-700 sm:mt-8">
                  Centralized platform for reporting and resolving AI accidents
                  and emergencies swiftly.
                </p>
                <div className="relative inline-flex items-center justify-center mt-8 sm:mt-12 group">
                  <div className="absolute transition-all duration-200 rounded-full -inset-px bg-gradient-to-r from-red-500 to-blue-500 group-hover:shadow-lg group-hover:shadow-red-500/50"></div>
                  <a
                    href="/login"
                    title=""
                    className="relative font-body4 font-semibold inline-flex items-center justify-center px-8 py-3 text-base  text-white bg-red-600 border border-transparent rounded-full"
                    role="button"
                  >
                    AI Admin Dashboard{" "}
                  </a>
                </div>
              </div>

              <div className="mt-8 z-10 md:absolute md:mt-0 md:top-32 lg:top-0 md:right-0">
                <img
                  className="w-full max-w-xs mx-auto  lg:max-w-2xl xl:max-w-2xl -mt-12"
                  src="bg1.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
