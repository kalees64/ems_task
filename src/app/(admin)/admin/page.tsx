"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useContext, useEffect, useState } from "react";
import DataContext from "../../../context/DataContext";

const Admin = () => {
  //Manage all user data and all attendance data states
  const [allUsers, setAllUsers] = useState([]);
  const [allAtt, setAllAtt] = useState([]);

  //Get data from the context API
  const { fetchData, fetchAtt } = useContext(DataContext);

  //Page startup Fuction
  const getUsers = async () => {
    const res = await fetchData();
    const res2 = await fetchAtt();
    setAllUsers(res);
    setAllAtt(res2);
  };

  useEffect(() => {
    getUsers();
  });
  return (
    <section className="bg-white shadow-md rounded p-4">
      <h2 className="text-lg font-semibold mb-4">Employee Reports</h2>
      <div className="w-full pt-5 px-6 max-sm:px-1 max-sm:overflow-x-scroll relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.no</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Employee Email</TableHead>
              <TableHead>Casual Leaves</TableHead>
              <TableHead>Sick Leaves</TableHead>
              <TableHead>Paid Leaves</TableHead>
              <TableHead>Payoff Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers.length > 0 ? (
              allUsers.map((user: any, index: number) => {
                const res2 = allAtt.filter(
                  (att: any) => att.emp_id === user.id
                );
                const present = res2.filter(
                  (att: any) => att.att === "present"
                );
                const leave = res2.filter((att: any) => att.att === "leave");
                const sLeave = res2.filter((att: any) => att.att === "s_leave");
                const pOff = res2.filter((att: any) => att.att === "payoff");

                return (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{present.length}</TableCell>
                    <TableCell>{leave.length}</TableCell>
                    <TableCell>{sLeave.length}</TableCell>
                    <TableCell>{pOff.length}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell>No Data</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default Admin;
