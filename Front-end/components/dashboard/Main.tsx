import React from "react";
import Navbar from "./Navbar";
import Top from "./Top";
import Dash from "./Dash";

export default function Main() {
  return (
    <div className="min-h-screen bg-[#333e51]">
      <Navbar />
      <Top />
      <Dash />
    </div>
  );
}
