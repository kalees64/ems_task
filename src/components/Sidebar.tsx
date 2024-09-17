import Link from "next/link";
import React from "react";

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col space-y-4 p-4">
      <nav className="flex flex-col space-y-4">
        <Link href="/admin" className="hover:bg-gray-700 p-2 rounded">
          Reports
        </Link>
        <Link href="/admin/employees" className="hover:bg-gray-700 p-2 rounded">
          All Employees List
        </Link>
        <Link href="/admin/mails" className="hover:bg-gray-700 p-2 rounded">
          New Leave Mails
        </Link>
        <Link href="/admin/all-mails" className="hover:bg-gray-700 p-2 rounded">
          All Mails
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
