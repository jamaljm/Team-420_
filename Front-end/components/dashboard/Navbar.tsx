"use client";
import React from "react";
import Link from "next/link";

import { useEffect } from "react";

export default function Navbar() {
//   const [user, setUser] = React.useState<any>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//       } else {
//         setUser(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);
//   console.log(user);
  return (
    <header>
      <div className="bg-[#212936] z-50 relative h-6 w-full border-b-2 rounded-b-3xl border-red-200">
        <div className="px-4 mx-auto sm:px-6 lg:px-12"></div>
      </div>
    </header>
  );
}
