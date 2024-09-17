"use client";

import { ReactNode, useContext, useEffect, useState } from "react";
import { Toaster } from "sonner";
import DataContext from "../../../context/DataContext";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  //Get Data from context API
  const { fetchData, API_URI } = useContext(DataContext);

  //Manage All Employe Details state
  const [allEmps, setAllEmps] = useState([]);

  //Get All employees list function
  const getAllEmps = async () => {
    const res = await fetchData();
    setAllEmps(res);
  };

  useEffect(() => {
    getAllEmps();
  }, []);

  return (
    <main className="w-full h-screen overflow-hidden">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar allEmps={allEmps} />
          <main className="p-4 h-full">{children}</main>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </main>
  );
};

export default AdminLayout;
