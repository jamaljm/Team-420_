import React from "react";
import Navbar from "./Navbar";
import Top from "./Top";
import Dash from "./Dash";

export default function Main() {
  return (
    <div className="min-h-screen bg-gradient-to-r  from-green-100  to-blue-100">
      <Navbar />
      <Top />
      <Dash />
    </div>
  );
}
