"use client";
import DataContext from "@/context/DataContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useContext } from "react";

const Sidebar = () => {
  const { side, setSide } = useContext(DataContext);
  return (
    <div className="h-full w-full bg-[#1e293b] text-white flex flex-col space-y-4 p-4 ">
      <h1 className="text-xl font-bold max-lg:hidden w-full pt-2 ps-3 cursor-pointer">
        Admin Panel
      </h1>
      <nav className="flex flex-col space-y-4 pt-2 max-lg:pt-0 max-lg:pb-4 font-semibold">
        <Link
          href="/admin/employees"
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center"
          onClick={() => {
            setSide(!side);
          }}
        >
          <Icon icon="flowbite:users-outline" fontSize={25} />

          <p>All Employees List</p>
        </Link>
        <Link
          href="/admin"
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center"
          onClick={() => {
            setSide(!side);
          }}
        >
          <Icon icon="iconoir:reports" fontSize={25} />
          <p>Reports</p>
        </Link>
        <Link
          href="/admin/mails"
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center"
          onClick={() => {
            setSide(!side);
          }}
        >
          <Icon icon="uiw:mail-o" fontSize={25} />
          <p>Mails</p>
        </Link>

        <Link
          href="/admin/holidays"
          className="text-[#637085] hover:text-[#94A3B8] p-2 rounded flex gap-4 items-center"
          onClick={() => {
            setSide(!side);
          }}
        >
          <Icon icon="uil:calender" fontSize={25} />
          <p>Holidays</p>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
