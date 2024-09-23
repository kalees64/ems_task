"use client";

import { ReactNode, useContext, useEffect, useState } from "react";
import { Toaster } from "sonner";
import DataContext from "../../../context/DataContext";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";

const AdminLayout = ({ children }: { children: ReactNode }) => {
  //Get Data from context API
  const { fetchData, getBirthDay, birUser, setBirUser } =
    useContext(DataContext);

  //Manage All Employe Details state
  const [allEmps, setAllEmps] = useState([]);

  //Get All employees list function
  const getAllEmps = async () => {
    const res = await fetchData();
    setAllEmps(res);
    await getBirthDay();
  };

  useEffect(() => {
    getAllEmps();
  }, [fetchData]);

  return (
    <main className="w-full h-screen overflow-hidden">
      <div className="flex">
        <div className="max-lg:hidden w-64">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col bg-white text-black h-screen w-full overflow-x-scroll">
          <Navbar allEmps={allEmps} />
          {/* Birthday wish section */}
          {birUser.length > 0 && (
            <div className="w-full py-2 border-2 border-lime-400 rounded flex flex-col justify-center items-center my-2 max-sm:h-20 max-sm:ps-5">
              {birUser.map((user: any) => {
                return (
                  <h1 key={user.id} className="max-sm:text-sm">
                    {user.role.title} <b>{user.name}</b> celebrating his
                    birthday today !!!
                  </h1>
                );
              })}
            </div>
          )}

          <main className="p-4 h-full w-full ">{children}</main>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </main>
  );
};

export default AdminLayout;
