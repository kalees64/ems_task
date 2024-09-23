"use client";
import React, { useContext, useState } from "react";
import DataContext from "../context/DataContext";
import { format } from "date-fns";
import axios from "axios";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react/dist/iconify.js";

const Navbar = ({ allEmps }: { allEmps: any }) => {
  //Get data from the context API
  const {
    fetchOneData,
    API_URI,
    router,
    adminState,
    setAdminState,
    fetchAtt,
    load,
    setLoad,
  } = useContext(DataContext);

  //States for employee manual attendace form
  const [empid, setEmpid] = useState("");
  const [empName, setEmpName] = useState("");
  const [attDate, setAttDate] = useState("");
  const [att, setAtt] = useState("");

  //Employee attence post fuction
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (empid === "null" || att === "null" || !empid || !empName || !att) {
      return alert("Fill out all the fields");
    }
    const allAtt = await fetchAtt();
    const userAtt = allAtt.find(
      (att: any) =>
        att.emp_id === empid && att.date === format(attDate, "dd/MM/yyyy")
    );
    if (userAtt) {
      setEmpName("");
      setEmpid("");
      setAtt("");
      setAttDate("");
      return setTimeout(() => {
        toast.error("Already Marked");
      }, 100);
    }
    const newAtt = {
      emp_id: empid,
      name: empName,
      date: format(attDate, "dd/MM/yyyy"),
      att: att,
    };
    const res = await axios.post(`${API_URI}/attendances`, {
      emp_id: empid,
      name: empName,
      date: format(attDate, "dd/MM/yyyy"),
      att: att,
    });
    setTimeout(() => {
      toast.success("Attendance Posted", {
        description: `${empName} attendance for ${format(
          attDate,
          "dd/MM/yyyy"
        )} is ${att}`,
      });
    }, 100);
    setEmpName("");
    setEmpid("");
    setAtt("");
    setAttDate("");
  };
  return (
    <div className="flex items-center justify-end bg-gray-100 p-4 shadow-md">
      {/* <div>Admin Dashboard</div> */}
      <div className="space-x-4 flex gap-3 items-center">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Employee Attendance</Button>
          </DialogTrigger>

          <DialogContent className="bg-white">
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <DialogHeader>
                <DialogTitle>Employee Attendance Form</DialogTitle>
              </DialogHeader>
              <div>
                <Label>Employee ID</Label>
                <Select
                  onValueChange={async (value) => {
                    setEmpid(value);
                    if (value === "null") {
                      setEmpName("");
                      return alert("Select Employee ID");
                    }
                    const res = await fetchOneData(value);
                    setEmpName(res.name);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Employee ID" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup defaultValue={empid}>
                      <SelectLabel>Employee ID</SelectLabel>
                      {allEmps.map((user: any) => {
                        return (
                          <SelectItem value={user.id} key={user.id}>
                            {user.id}
                          </SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Employee Name</Label>
                <Input
                  placeholder="Employee Name"
                  disabled
                  defaultValue={empName}
                  required
                />
              </div>
              <div>
                <Label>Date</Label>
                <Input
                  placeholder="Date"
                  type="date"
                  value={attDate}
                  required
                  onChange={(e) => {
                    setAttDate(e.target.value);
                  }}
                />
              </div>
              <div>
                <Label>Attendance</Label>
                <Select
                  onValueChange={(value) => {
                    setAtt(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Attendance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Attendance Type</SelectLabel>
                      <SelectItem value="pre">Present</SelectItem>
                      <SelectItem value="present">Casual Leave</SelectItem>
                      <SelectItem value="s_leave">Sick Leave</SelectItem>
                      <SelectItem value="leave">Paid Leave</SelectItem>
                      <SelectItem value="payoff">Pay OFF</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-3">
                <Button type="submit" className="w-full">
                  POST
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            {/* <Button>Logout</Button> */}
            <Icon
              icon="lucide:log-out"
              fontSize={35}
              className="cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle>Do you want logout?</DialogTitle>
              <DialogDescription>Click yes to logout</DialogDescription>
            </DialogHeader>
            <div className="flex gap-5">
              <Button
                onClick={() => {
                  setLoad(true);
                  localStorage.removeItem("token");
                  router.push("/");
                  setTimeout(() => {
                    toast.info("Logged Out");
                  }, 100);
                  setAdminState(false);
                  setLoad(false);
                }}
                disabled={load}
                className=""
              >
                {load && (
                  <span className="w-5 h-5 border-4 border-t-white border-gray-600 rounded-full animate-spin me-2"></span>
                )}
                Yes
              </Button>
              <DialogClose asChild>
                <Button className="bg-red-700">Cancel</Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Navbar;
