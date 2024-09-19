"use client";
import Form from "@/components/form/form";
import FormInput from "@/components/form/formInput";
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
import axios from "axios";
import { format } from "date-fns";
import React, { useContext, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

const Holidays = () => {
  //Get data from context API
  const { fetchHolidays, API_URI } = useContext(DataContext);

  //Manage all Holidays state
  const [holidays, setHolidays] = useState([]);

  //Add Holiday states
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [publicHoliday, setPublicHoliday] = useState(true);

  //Update Holiday states
  const [uname, setuName] = useState("");
  const [udate, setuDate] = useState("");
  const [upublicHoliday, setuPublicHoliday] = useState();

  //Add new holiday function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const hDate = format(date, "dd/MM/yyyy");
    const newHoliday = { name, date: hDate, publicHoliday };
    const res = await fetchHolidays();
    const findHoliday = res.find((data) => data.date === hDate);
    if (findHoliday) {
      setName("");
      setDate("");
      setPublicHoliday(true);
      return setTimeout(() => {
        toast.error("Holiday Already Found");
      }, 100);
    }
    const add = await axios.post(`${API_URI}/holidays`, { ...newHoliday });
    await startup();
    setTimeout(() => {
      toast.success("Holiday Added");
    }, 100);
    setName("");
    setDate("");
    setPublicHoliday(true);
  };

  //Update Holiday Form
  const handleEdit = async (e, id) => {
    e.preventDefault();
    const updatedHoliday = {
      id,
      name: uname,
      date: format(udate, "dd/MM/yyyy"),
      publicHoliday: upublicHoliday,
    };
    // console.log(updatedHoliday);
    const add = await axios.patch(`${API_URI}/holidays/${id}`, {
      ...updatedHoliday,
    });
    setTimeout(() => {
      toast.success("Holiday Updated");
    }, 100);
    await startup();
  };

  //Delete function
  const handleDelete = async (id) => {
    const add = await axios.delete(`${API_URI}/holidays/${id}`);
    setTimeout(() => {
      toast.success("Holiday Deleted");
    }, 100);
    await startup();
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
      <section className="bg-white shadow-md rounded p-4 h-screen overflow-y-scroll">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold mb-4 pe-5">
            Employees Leave Mails
          </h1>
          <div>
            {/* Add Holiday Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button>Add Holiday</Button>
              </DialogTrigger>
              <DialogContent className="bg-white">
                <DialogHeader>
                  <DialogTitle>Add Holiday</DialogTitle>
                  <DialogDescription className="hidden">
                    holiday
                  </DialogDescription>
                  <form
                    onSubmit={(e) => {
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
                    <DialogClose asChild>
                      <Button type="submit">submit</Button>
                    </DialogClose>
                  </form>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="pb-40">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Leave Name</TableHead>
                <TableHead>Leave Date</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.length > 0 ? (
                holidays.map((data, index) => {
                  return (
                    <TableRow key={data.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{data.name}</TableCell>
                      <TableCell>{data.date}</TableCell>
                      <TableCell>
                        {data.publicHoliday
                          ? "Public Holiday"
                          : "Internal Holiday"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-3 items-center">
                          <div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  onClick={async () => {
                                    const res = await fetchHolidays();
                                    const findHoliday = res.find(
                                      (val) => val.id === data.id
                                    );
                                    setuName(findHoliday.name);
                                    const hDate = format(
                                      Date(findHoliday.date),
                                      "yyy-MM-dd"
                                    );
                                    setuDate(hDate);
                                    setuPublicHoliday(
                                      findHoliday.publicHoliday ? true : false
                                    );
                                  }}
                                >
                                  Edit
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-white">
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
                                      <Button type="submit">update</Button>
                                    </DialogClose>
                                  </form>
                                </DialogHeader>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <Button
                            onClick={() => {
                              handleDelete(data.id);
                            }}
                          >
                            Delete
                          </Button>
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
