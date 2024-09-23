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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import React, { useContext, useEffect, useState } from "react";
import DataContext from "../../../../context/DataContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    load,
    setLoad,
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
    <section className="w-full ">
      <div className="w-full flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold ">All Employees</h2>

        <div
          className="bg-black p-2 rounded text-white flex gap-2 items-center cursor-pointer"
          onClick={() => {
            setAdminState(!adminState);
            router.push("/register");
          }}
        >
          <Icon icon="gg:add-r" fontSize={25} />
          <p>Add Employee</p>
        </div>
      </div>
      <div className="w-80">
        <Card className="">
          <CardContent className="flex pt-4">
            <div className="flex flex-col justify-center gap-3 ">
              <h1>Total Employees</h1>
              <h1 className="font-bold text-xl font-sans">{allUsers.length}</h1>
            </div>
            <div className="w-5/12 flex justify-end items-center">
              <Icon
                icon="flowbite:users-outline"
                fontSize={25}
                className="text-black/50"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full mt-5 pt-2 max-sm:px-1  relative px-4">
        <h2 className="text-lg font-semibold ps-2 pb-2 pt-2">Employees List</h2>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Employee Email</TableHead>
              <TableHead>Employee Phone</TableHead>
              <TableHead className="text-center">Action</TableHead>
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
                    <TableCell className="flex items-center gap-3 justify-center">
                      {/* Employee Editing Form */}
                      <Dialog>
                        <DialogTrigger>
                          <Icon
                            icon="mage:edit"
                            fontSize={30}
                            className=" cursor-pointer"
                            onClick={async () => {
                              setValues(await getUser(user.id));
                            }}
                          />
                        </DialogTrigger>
                        <DialogContent className="bg-white text-black max-sm:w-11/12">
                          <DialogHeader>
                            <h1>Employee Update Form</h1>
                          </DialogHeader>
                          <form
                            className="w-full p-6 flex flex-col gap-4"
                            onSubmit={(e) => {
                              handleUpdate(e, user);
                            }}
                          >
                            <div>
                              <Label>Name</Label>
                              <Input
                                type="text"
                                placeholder="Employee Name"
                                value={uName}
                                onChange={(e) => {
                                  setuName(e.target.value);
                                }}
                                className=" text-lg"
                              />
                            </div>
                            <div>
                              <Label>Email</Label>
                              <Input
                                type="text"
                                placeholder="Employee Email"
                                value={uEmail}
                                onChange={(e) => {
                                  setuEmail(e.target.value);
                                }}
                                className=" text-lg"
                              />
                            </div>
                            <div>
                              <Label>Phone</Label>
                              <Input
                                type="text"
                                placeholder="Employee Phone"
                                value={uPhone}
                                onChange={(e) => {
                                  setuPhone(e.target.value);
                                }}
                                className=" text-lg"
                              />
                            </div>

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

                      <Dialog>
                        <DialogTrigger asChild>
                          <Icon
                            icon="ic:baseline-delete-forever"
                            fontSize={30}
                            className="cursor-pointer"
                          />
                        </DialogTrigger>
                        <DialogContent className="bg-white text-black max-sm:w-11/12">
                          <DialogHeader>
                            <DialogTitle>
                              Do you want delete {user.name}?
                            </DialogTitle>
                            <DialogDescription>
                              Click yes to delete
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-5">
                            <DialogClose asChild>
                              <Button
                                onClick={async () => {
                                  setLoad(true);
                                  const res = await handleDelete(user.id);
                                  if (res) {
                                    await getUsers();
                                    const users = allUsers.filter(
                                      (data: any) => data.id !== user.id
                                    );
                                    setAllUsers(users);
                                    setLoad(false);
                                  }
                                }}
                                disabled={load}
                              >
                                {load && (
                                  <span className="w-5 h-5 border-4 border-t-white border-gray-600 rounded-full animate-spin me-2"></span>
                                )}
                                Yes
                              </Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button className="bg-red-700">Cancel</Button>
                            </DialogClose>
                          </div>
                        </DialogContent>
                      </Dialog>
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
      </Card>
    </section>
  );
};

export default Employees;
