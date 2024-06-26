"use client";
import CoinIcon from "../../public/admin/coin.svg";
import OrderIcon from "../../public/admin/order.svg";
import CustomerIcon from "../../public/admin/customer.svg";
import ArrowUpIcon from "../../public/admin/arrow-up.svg";
import ArrowDownIcon from "../../public/admin/arrow-down.svg";
import { supabase } from "../../config/supabase/client";
import { use, useEffect, useState } from "react";

function StatsCard({ stat }: { stat: any }) {
  const statusClass =
    stat.status === "up" ? "text-accent-green" : "text-accent-red";
  const arrowIcon =
    stat.status === "up" ? (
      <svg
        className="fill-current text-accent-green"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M6.99994 12.25C6.75473 12.25 6.55208 12.0704 6.52 11.8375L6.51558 11.7727L6.51583 3.38275L3.45258 6.4139C3.26384 6.60069 2.95716 6.60134 2.7676 6.41535C2.59528 6.24628 2.57906 5.98116 2.71935 5.79402L2.76613 5.74039L6.65645 1.89039L6.66665 1.88095C6.67711 1.87118 6.68801 1.86186 6.69932 1.85302L6.65645 1.89039C6.67519 1.87184 6.6951 1.85513 6.71594 1.84025C6.72903 1.83126 6.74262 1.82253 6.75666 1.81448C6.7879 1.79629 6.82059 1.7822 6.85421 1.7718C6.86606 1.7683 6.87816 1.76504 6.89044 1.76225C6.89982 1.75997 6.90934 1.7581 6.91891 1.75652C6.92928 1.75493 6.93965 1.75355 6.95012 1.75249C6.96063 1.7513 6.97138 1.75057 6.98213 1.75018C6.98809 1.7501 6.994 1.75 6.99994 1.75L7.01602 1.75014C7.02795 1.75054 7.03986 1.75136 7.05174 1.75262L6.99994 1.75C7.02759 1.75 7.05471 1.75229 7.0811 1.75667C7.09313 1.75863 7.1052 1.76112 7.11719 1.76406C7.12671 1.76641 7.13606 1.76901 7.14529 1.77187C7.15626 1.77524 7.16731 1.77909 7.17823 1.78336C7.18951 1.78778 7.20053 1.79257 7.21133 1.79774C7.2196 1.80165 7.22812 1.80604 7.23653 1.81069C7.25231 1.81946 7.26712 1.82875 7.28135 1.83878C7.28358 1.84036 7.28604 1.84212 7.28848 1.84392C7.3101 1.85984 7.32917 1.87633 7.34683 1.89419L11.2338 5.74036C11.4226 5.92713 11.422 6.22933 11.2324 6.41533C11.0601 6.58442 10.791 6.59927 10.6017 6.46025L10.5474 6.41393L7.48475 3.38333L7.48429 11.7727C7.48429 12.0363 7.26744 12.25 6.99994 12.25Z" />
      </svg>
    ) : (
      <svg
        className="fill-current text-accent-red"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M7.33356 1.75C7.57877 1.75 7.78142 1.92955 7.81349 2.16251L7.81791 2.22727L7.81766 10.6172L10.8809 7.5861C11.0697 7.39931 11.3763 7.39866 11.5659 7.58465C11.7382 7.75372 11.7544 8.01884 11.6141 8.20598L11.5674 8.25961L7.67704 12.1096L7.66684 12.119C7.65638 12.1288 7.64548 12.1381 7.63417 12.147L7.67704 12.1096C7.6583 12.1282 7.6384 12.1449 7.61756 12.1597C7.60447 12.1687 7.59088 12.1775 7.57684 12.1855C7.5456 12.2037 7.5129 12.2178 7.47929 12.2282C7.46744 12.2317 7.45533 12.235 7.44305 12.2378C7.43368 12.24 7.42415 12.2419 7.41458 12.2435C7.40422 12.2451 7.39384 12.2465 7.38337 12.2475C7.37286 12.2487 7.36212 12.2494 7.35137 12.2498C7.34541 12.2499 7.3395 12.25 7.33356 12.25L7.31748 12.2499C7.30555 12.2495 7.29363 12.2486 7.28175 12.2474L7.33356 12.25C7.3059 12.25 7.27879 12.2477 7.25239 12.2433C7.24037 12.2414 7.22829 12.2389 7.21631 12.2359C7.20678 12.2336 7.19743 12.231 7.1882 12.2281C7.17724 12.2248 7.16619 12.2209 7.15526 12.2166C7.14398 12.2122 7.13296 12.2074 7.12216 12.2023C7.1139 12.1983 7.10538 12.194 7.09696 12.1893C7.08118 12.1805 7.06638 12.1712 7.05214 12.1612C7.04992 12.1596 7.04746 12.1579 7.04501 12.1561C7.02339 12.1402 7.00432 12.1237 6.98666 12.1058L3.09965 8.25964C2.91089 8.07287 2.91153 7.77067 3.10107 7.58467C3.27338 7.41558 3.5425 7.40073 3.73182 7.53975L3.78605 7.58607L6.84875 10.6167L6.84921 2.22727C6.84921 1.96368 7.06606 1.75 7.33356 1.75Z" />
      </svg>
    );

  return (
    <div className="flex flex-col  p-3 pl-4 w-1/3 bg-gray-900 rounded-lg z-50 gap-y-3">
      <div className="flex items-center gap-x-3">
        <div className="flex items-center gap-4 ">
          <div className="">
            <div className="p-2 bg-gray-800 rounded-lg">
              <img src={stat.icon}></img>
            </div>
          </div>
          {/* <span className={`text-xs text-white font-medium ${statusClass}`}>
          {stat.percentage}
        </span>
        <div className="p-0.5 rounded-full bg-green-100">{arrowIcon}</div> */}
          <div className="">
            <div className="text-sm font-body4 tracking-wide text-gray-200">
              {stat.title}
            </div>

            <div className="text-2xl font-body4 font-semibold text-white">
              {stat.value}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatsCardList() {
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from("main_table")
        .select("*")
        .order("id", { ascending: true });
      console.log(data);

      if (data) {
        console.log(data);
        const commonTrueData = data.filter(
          (item) => item.common_status === true
        );
        const commonTrueDatafalse = data.filter(
          (item) => item.common_status === false
        );
        setTotal(commonTrueDatafalse.length);

        setCompleted(commonTrueData.length);
      }
    }
    fetchStats();
  }, []);
  const stats = [
    {
      title: "New",
      percentage: "+234",
      value: total,
      status: "up",
      icon: "https://img.icons8.com/material-rounded/24/FFFFFF/plus-math--v1.png",
    },
    {
      title: "Pending",
      percentage: "-34",
      value: total,
      status: "down",
      icon: "/clock-svgrepo-com2.svg",
    },
    {
      title: "Completed",
      percentage: "+130",
      value: completed,
      status: "up",
      icon: "https://img.icons8.com/windows/26/FFFFFF/checked--v1.png",
    },
  ];
  return (
    <div className="flex gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} stat={stat} />
      ))}
    </div>
  );
}
