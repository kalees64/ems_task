import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col space-y-4 p-4">
      <h1 className="text-xl font-bold">Admin Panel</h1>
      <nav className="flex flex-col space-y-4 pt-4">
        <div className="hover:bg-gray-700 p-2 rounded flex gap-4 items-center">
          <Icon icon="flowbite:users-outline" fontSize={25} />
          <Link href="/admin/employees">All Employees List</Link>
        </div>
        <div className="hover:bg-gray-700 p-2 rounded flex gap-4 items-center">
          <Icon icon="iconoir:reports" fontSize={25} />
          <Link href="/admin">Reports</Link>
        </div>
        <div className="hover:bg-gray-700 p-2 rounded flex gap-4 items-center">
          <Icon icon="uiw:mail-o" fontSize={25} />
          <Link href="/admin/mails">New Leave Mails</Link>
        </div>
        <div className="hover:bg-gray-700 p-2 rounded flex gap-4 items-center">
          <Icon icon="humbleicons:mail-open" fontSize={25} />
          <Link href="/admin/all-mails">All Mails</Link>
        </div>
        <div className="hover:bg-gray-700 p-2 rounded flex gap-4 items-center">
          <Icon icon="uil:calender" fontSize={25} />
          <Link href="/admin/holidays">Holidays</Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
