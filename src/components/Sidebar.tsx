"use client";
import DataContext from "@/context/DataContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React, { useContext } from "react";

const Sidebar = () => {
  const { side, setSide } = useContext(DataContext);
  return (
    <div className="h-full w-full bg-gray-800 text-white flex flex-col space-y-4 p-4 ">
      <h1 className="text-xl font-bold max-lg:hidden">Admin Panel</h1>
      <nav className="flex flex-col space-y-4 pt-4 max-lg:pt-0 max-lg:pb-4">
        <Link
          href="/admin/employees"
          className="hover:bg-gray-700 p-2 rounded flex gap-4 items-center"
          onClick={() => {
            setSide(!side);
          }}
        >
          <Icon icon="flowbite:users-outline" fontSize={25} />
          <p>All Employees List</p>
        </Link>
        <Link
          href="/admin"
          className="hover:bg-gray-700 p-2 rounded flex gap-4 items-center"
          onClick={() => {
            setSide(!side);
          }}
        >
          <Icon icon="iconoir:reports" fontSize={25} />
          <p>Reports</p>
        </Link>
        <Link
          href="/admin/mails"
          className="hover:bg-gray-700 p-2 rounded flex gap-4 items-center"
          onClick={() => {
            setSide(!side);
          }}
        >
          <Icon icon="uiw:mail-o" fontSize={25} />
          <p>Mails</p>
        </Link>
        {/* <Link
          href="/admin/all-mails"
          className="hover:bg-gray-700 p-2 rounded flex gap-4 items-center"
        >
          <Icon icon="humbleicons:mail-open" fontSize={25} />
          <p>All Mails</p>
        </Link> */}
        <Link
          href="/admin/holidays"
          className="hover:bg-gray-700 p-2 rounded flex gap-4 items-center"
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
