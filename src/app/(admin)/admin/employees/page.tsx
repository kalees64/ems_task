"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import React, { useContext, useEffect, useState } from "react";
import DataContext from "../../../../context/DataContext";

const Employees = () => {
  //Manage all users state
  const [allUsers, setAllUsers] = useState([]);

  //Get data from the context API
  const {
    fetchData,
    handleDelete,
    fetchOneData,
    adminState,
    setAdminState,
    router,
    setuName,
    uName,
    uEmail,
    uPhone,
    setuEmail,
    setuPhone,
    handleUpdate,
  } = useContext(DataContext);

  //Set the selected user values to the edit form
  const setValues = (user: any) => {
    setuName(user.name);
    setuEmail(user.email);
    setuPhone(user.phone);
  };

  //Get all users function
  const getUsers = async () => {
    const res = await fetchData();
    setAllUsers(res);
  };

  //Get one user function
  const getUser = async (id: string) => {
    const res = await fetchOneData(id);
    return res;
  };

  useEffect(() => {
    getUsers();
  }, [fetchData]);
  return (
    <section className="w-full p-3 px-6">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-4">All Employees</h2>
        <button
          className="bg-cyan-600 p-2 rounded text-white"
          onClick={() => {
            setAdminState(!adminState);
            router.push("/register");
          }}
        >
          Add Employee
        </button>
      </div>
      <div className="w-full pt-5 px-6 max-sm:px-1 max-sm:overflow-x-scroll relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Employee Email</TableHead>
              <TableHead>Employee Phone</TableHead>
              <TableHead className="text-center" colSpan={2}>
                Action
              </TableHead>
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
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {/* Employee Editing Form */}
                      <Dialog>
                        <DialogTrigger>
                          <Icon
                            icon="mdi:account-edit-outline"
                            fontSize={30}
                            color="white"
                            className="w-full p-1  bg-lime-500 rounded active:bg-blue-500 cursor-pointer"
                            onClick={async () => {
                              setValues(await getUser(user.id));
                            }}
                          />
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                          <DialogHeader>
                            <h1>Employee Update Form</h1>
                          </DialogHeader>
                          <form
                            className="w-full p-6 flex flex-col gap-4"
                            onSubmit={(e) => {
                              handleUpdate(e, user);
                            }}
                          >
                            <input
                              type="text"
                              placeholder="Employee Name"
                              value={uName}
                              onChange={(e) => {
                                setuName(e.target.value);
                              }}
                              className="w-full h-10 indent-3 focus:outline-none rounded text-lg"
                            />
                            <input
                              type="text"
                              placeholder="Employee Email"
                              value={uEmail}
                              onChange={(e) => {
                                setuEmail(e.target.value);
                              }}
                              className="w-full h-10 indent-3 focus:outline-none rounded text-lg"
                            />
                            <input
                              type="text"
                              placeholder="Employee Phone"
                              value={uPhone}
                              onChange={(e) => {
                                setuPhone(e.target.value);
                              }}
                              className="w-full h-10 indent-3 focus:outline-none rounded text-lg"
                            />

                            <DialogClose asChild>
                              <input
                                type="submit"
                                value="Update"
                                className="w-full h-10  text-lg bg-blue-500 rounded cursor-pointer text-white"
                              />
                            </DialogClose>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                    <TableCell>
                      <Icon
                        icon="ic:baseline-delete-forever"
                        fontSize={30}
                        className="p-1 w-full bg-red-500 rounded active:bg-yellow-500 cursor-pointer"
                        color="white"
                        onClick={async () => {
                          handleDelete(user.id);
                          await getUsers();
                          const users = allUsers.filter(
                            (data: any) => data.id !== user.id
                          );
                          setAllUsers(users);
                        }}
                      />
                    </TableCell>
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

export default Employees;
