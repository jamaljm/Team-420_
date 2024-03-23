import { Button } from "@nextui-org/button";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className="flex flex-col gap-4 w-1/3">
        <Link
          href="/police"
          className="block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded text-center"
        >
          Police
        </Link>
        <Link
          href="/ambulance"
          className="block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded text-center"
        >
          Ambulance
        </Link>
        <Link
          href="/fireforce"
          className="block bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded text-center"
        >
          Fire Fighter
        </Link>{" "}
        <Link
          href="/shepolice"
          className="block bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded text-center"
        >
          ShePolice
        </Link>
      </div>
    </div>
  );
}
