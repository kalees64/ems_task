"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataContext from "@/context/DataContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import axios from "axios";
import { format, parseISO } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

const Holidays = () => {
  //Get data from context API
  const { fetchHolidays, load, setLoad } = useContext(DataContext);

  //Manage all Holidays state
  const [holidays, setHolidays] = useState([]);

  //Add Holiday states
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [publicHoliday, setPublicHoliday] = useState<boolean>(true);

  //Update Holiday states
  const [uname, setuName] = useState("");
  const [udate, setuDate] = useState("");
  const [upublicHoliday, setuPublicHoliday] = useState<boolean>(true);

  //Add new holiday function
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const hDate = format(date, "dd/MM/yyyy");
    const newHoliday = { name, date: hDate, publicHoliday };
    const res = await fetchHolidays();
    const findHoliday = res.find((data: any) => data.date === hDate);
    if (findHoliday) {
      setName("");
      setDate("");
      setPublicHoliday(true);
      setLoad(false);
      return setTimeout(() => {
        toast.error("Holiday Already Found");
      }, 100);
    }
    const add = await axios.post(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/holidays`,
      { ...newHoliday }
    );
    await startup();
    setLoad(false);
    setTimeout(() => {
      toast.success("Holiday Added");
    }, 100);
    setName("");
    setDate("");
    setPublicHoliday(true);
    setLoad(false);
  };

  //Update Holiday Form
  const handleEdit = async (e: any, id: string) => {
    e.preventDefault();
    const updatedHoliday = {
      id,
      name: uname,
      date: format(udate, "dd/MM/yyyy"),
      publicHoliday: upublicHoliday,
    };
    // console.log(updatedHoliday);
    const add = await axios.patch(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/holidays/${id}`,
      {
        ...updatedHoliday,
      }
    );
    setTimeout(() => {
      toast.success("Holiday Updated");
    }, 100);
    await startup();
    setLoad(false);
  };

  //Delete function
  const handleDelete = async (id: string) => {
    const add = await axios.delete(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/holidays/${id}`
    );
    setLoad(false);
    setTimeout(() => {
      toast.success("Holiday Deleted");
    }, 100);
    await startup();
    setLoad(false);
  };

  //component starter function
  const startup = async () => {
    const res = await fetchHolidays();
    setHolidays(res);
  };

  //UseEffect hook
  useEffect(() => {
    startup();
  }, [fetchHolidays]);

  return (
    <div>
      <section className="bg-white rounded-xl shadow  p-4 ">
        <div className="flex items-center justify-between pb-4">
          <h1 className="text-lg font-semibold mb-4 pe-5">Holidays</h1>
          <div>
            {/* Add Holiday Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center gap-2 p-1.5 rounded-sm cursor-pointer bg-[#6343d8] hover:bg-[#593cc1]">
                  <Icon icon="zondicons:date-add" fontSize={25} color="white" />
                  <span className="text-white">Add Holiday</span>
                </div>
              </DialogTrigger>
              <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                <DialogHeader>
                  <DialogTitle>Add Holiday</DialogTitle>
                  <DialogDescription className="hidden">
                    holiday
                  </DialogDescription>
                  <form
                    onSubmit={(e) => {
                      setLoad(true);
                      handleSubmit(e);
                    }}
                  >
                    <div>
                      <Label>Holiday Name</Label>
                      <Input
                        placeholder="Diwali"
                        required
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      />
                    </div>
                    <div className="pt-2">
                      <Label>Holiday Date</Label>
                      <Input
                        type="date"
                        required
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-8 items-center pt-2 pb-3">
                      <Label>Public Holiday</Label>
                      <Input
                        type="checkbox"
                        defaultChecked={publicHoliday ? true : false}
                        onClick={() => {
                          setPublicHoliday(!publicHoliday);
                        }}
                        className="size-6"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={load}
                      className="bg-[#754ffe] hover:bg-[#6f42c1]"
                    >
                      {load && (
                        <span className="w-5 h-5 border-4 border-t-white border-gray-600 rounded-full animate-spin me-2"></span>
                      )}
                      submit
                    </Button>
                  </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#f1f5f9]">
                <TableHead className="font-bold text-black">S.No</TableHead>
                <TableHead className="font-bold text-black">
                  Leave Name
                </TableHead>
                <TableHead className="font-bold text-black">
                  Leave Date
                </TableHead>
                <TableHead className="font-bold text-black">
                  Leave Type
                </TableHead>
                <TableHead className="font-bold text-black">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[#637085]">
              {holidays.length > 0 ? (
                holidays.map((data: any, index) => {
                  return (
                    <TableRow key={data.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="text-black">{data.name}</TableCell>
                      <TableCell>{data.date}</TableCell>
                      <TableCell>
                        {data.publicHoliday
                          ? "Public Holiday"
                          : "Internal Holiday"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3 items-center ">
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Icon
                                  icon="material-symbols-light:edit-calendar-outline"
                                  fontSize={30}
                                  className=" cursor-pointer"
                                  onClick={async () => {
                                    const res = await fetchHolidays();
                                    const findHoliday: any = res.find(
                                      (val: any) => val.id === data.id
                                    );
                                    setuName(findHoliday.name);

                                    const fDate =
                                      findHoliday.date.slice(6) +
                                      "-" +
                                      findHoliday.date.slice(3, 5) +
                                      "-" +
                                      findHoliday.date.slice(0, 2);

                                    setuDate(fDate);
                                    setuPublicHoliday(
                                      findHoliday.publicHoliday ? true : false
                                    );
                                  }}
                                />
                              </DialogTrigger>
                              <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                                <DialogHeader>
                                  <DialogTitle>Update Holiday</DialogTitle>
                                  <DialogDescription className="hidden">
                                    holiday
                                  </DialogDescription>
                                  <form
                                    onSubmit={(e) => {
                                      handleEdit(e, data.id);
                                    }}
                                  >
                                    <div>
                                      <Label>Holiday Name</Label>
                                      <Input
                                        placeholder="Diwali"
                                        required
                                        value={uname}
                                        onChange={(e) => {
                                          setuName(e.target.value);
                                        }}
                                      />
                                    </div>
                                    <div className="pt-2">
                                      <Label>Holiday Date</Label>
                                      <Input
                                        type="date"
                                        required
                                        value={udate}
                                        onChange={(e) =>
                                          setuDate(e.target.value)
                                        }
                                      />
                                    </div>
                                    <div className="flex gap-8 items-center pt-2 pb-3">
                                      <Label>Public Holiday</Label>
                                      <Input
                                        type="checkbox"
                                        defaultChecked={
                                          upublicHoliday ? true : false
                                        }
                                        onClick={() => {
                                          setuPublicHoliday(!upublicHoliday);
                                        }}
                                        className="size-6"
                                      />
                                    </div>
                                    <DialogClose asChild>
                                      <Button
                                        type="submit"
                                        className="bg-[#754ffe] hover:bg-[#6f42c1]"
                                      >
                                        update
                                      </Button>
                                    </DialogClose>
                                  </form>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Icon
                                icon="ic:baseline-delete-forever"
                                fontSize={30}
                                className="cursor-pointer"
                              />
                            </DialogTrigger>
                            <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                              <DialogHeader>
                                <DialogTitle>
                                  Do you want delete {data.name}?
                                </DialogTitle>
                                <DialogDescription>
                                  Click yes to delete
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex gap-5">
                                <DialogClose asChild>
                                  <Button
                                    className="bg-[#754ffe] hover:bg-[#6f42c1]"
                                    onClick={() => {
                                      setLoad(true);
                                      handleDelete(data.id);
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
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No Data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
      <Toaster richColors position="top-center" />
    </div>
  );
};

export default Holidays;
