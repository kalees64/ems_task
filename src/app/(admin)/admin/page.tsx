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

  //Get data from the context API
  const { fetchData } = useContext(DataContext);

  //Page startup Fuction
  const getUsers = async () => {
    const res = await fetchData();
    const users = res.filter((user: any) => user.role.type === "employee");
    setAllUsers(users);
  };

  useEffect(() => {
    getUsers();
  }, [fetchData]);
  return (
    <section className="bg-white shadow-md rounded p-4 text-black">
      <h2 className="text-lg font-semibold mb-4">Employee Reports</h2>
      <div className="w-full pt-5  max-sm:px-1  relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.no</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Employee Email</TableHead>
              <TableHead>Casual Leaves</TableHead>
              <TableHead>Sick Leaves</TableHead>
              <TableHead>Paid Leaves</TableHead>
              <TableHead>Pending Leaves</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUsers.length > 0 ? (
              allUsers.map((user: any, index: number) => {
                return (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{12 - Number(user.casual_leaves)}</TableCell>
                    <TableCell>{12 - Number(user.sick_leaves)}</TableCell>
                    <TableCell>{12 - Number(user.paid_leaves)}</TableCell>
                    <TableCell>{user.pending_leaves}</TableCell>
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
