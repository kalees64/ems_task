"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DataContext from "../../../../context/DataContext";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import Calendar from "@/components/Calender";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Employee = () => {
  //Get param from url
  const { id } = useParams();

  //Manage user details - states
  const [user, setUser] = useState<any>({});

  //Get data from context API
  const {
    fetchOneData,
    updateState,
    setUpdateState,
    from,
    setFrom,
    to,
    setTo,
    reason,
    setReason,
    handelLeaveMail,
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
    setLeaveType,
    dob,
    setDob,
    getBirthDay,
    birUser,
    setBirUser,
    fetchHolidays,
  } = useContext(DataContext);

  // Fetch user Data

  const findUser = async () => {
    try {
      const res = await fetchOneData(id);
      // console.log(res);
      setUser(res);
    } catch (error: any) {
      if (error.status === 403) {
        router.push("/");
      }
    }
  };

  // Bar chart data
  const chartData = {
    labels: ["Casual Leave", "Sick Leave", "Paid Leave", "Pay OFF"],
    datasets: [
      {
        label: "Leave Days",
        data: [
          12 - Number(user.casual_leaves),
          12 - Number(user.sick_leaves),
          12 - Number(user.paid_leaves),
          user.pay_offs,
          30,
        ],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  };

  //Update form
  const setValues = (user: any) => {
    setuName(user.name);
    setuEmail(user.email);
    setuPhone(user.phone);
  };

  //Page startup fuctions
  const startUp = async () => {
    await findUser();
    await getBirthDay();
    await getHolidays();

    // setValues(user);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Define your custom holidays here in 'yyyy-MM-dd' format
  const holidays = [
    "2024-01-01", // New Year's Day
    "2024-12-25", // Christmas Day
    "2024-07-04", // Independence Day
  ];

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const [holi, setHoli] = useState<string[]>([]);

  const getHolidays = async () => {
    const all = await fetchHolidays();
    const newHolidays: string[] = [];
    const res = all.map((val: any) => {
      const fDate =
        val.date.slice(6) +
        "-" +
        val.date.slice(3, 5) +
        "-" +
        val.date.slice(0, 2);
      return newHolidays.push(fDate);
    });
    setHoli(newHolidays);
  };

  useEffect(() => {
    startUp();
  }, [user]);
  return (
    <div className="p-6 bg-[#f1f5f9] text-black">
      {/* Logout Button */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold max-md:text-xl max-sm:text-lg">
          Employee Dashboard
        </h1>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Icon
                icon="lucide:log-out"
                fontSize={35}
                className="cursor-pointer"
              />
            </DialogTrigger>
            <DialogContent className="bg-white text-black max-sm:w-11/12">
              <DialogHeader>
                <DialogTitle>Do you want logout?</DialogTitle>
                <DialogDescription>Click yes to logout</DialogDescription>
              </DialogHeader>
              <div className="flex gap-5">
                <Button
                  onClick={async () => {
                    setLoad(true);
                    try {
                      // const logout = await axios.post(
                      //   `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
                      //   {},
                      //   { withCredentials: true }
                      // );
                      // console.log(logout);
                      // localStorage.removeItem("token");
                      router.push("/");
                      setTimeout(() => {
                        toast.info("Logged Out");
                      }, 100);
                      setLoad(false);
                    } catch (error: any) {
                      setLoad(false);
                      setTimeout(() => {
                        toast.info(error.message);
                      }, 100);
                    }
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

      {/* Birthday wish section */}
      {birUser.length > 0 && (
        <div className="w-full py-2 border-2 border-lime-400 rounded flex flex-col justify-center items-center my-2 max-sm:h-20 max-sm:ps-5">
          {birUser.map((user: any) => {
            return (
              <h1 key={user.id} className="max-sm:text-sm">
                {user.role.title} <b>{user.name}</b> celebrating his birthday
                today !!!
              </h1>
            );
          })}
        </div>
      )}

      {/* Section 1: Leave Type Widgets */}
      <div className="grid grid-cols-6 gap-4 mb-8 max-md:grid-cols-2 max-lg:grid-cols-3">
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Total Leaves</h3>
          <p className="text-2xl font-bold">{user.total_leaves}</p>
          <p className="text-sm">Days</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Pending Leaves</h3>
          <p className="text-2xl font-bold">{user.pending_leaves}</p>
          <p className="text-sm">Days</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Casual Leaves</h3>
          <p className="text-2xl font-bold">
            {12 - Number(user.casual_leaves)}
          </p>
          <p className="text-sm">Days</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Sick Leaves</h3>
          <p className="text-2xl font-bold">{12 - Number(user.sick_leaves)}</p>
          <p className="text-sm">Days</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Paid Leaves</h3>
          <p className="text-2xl font-bold">{12 - Number(user.paid_leaves)}</p>
          <p className="text-sm">Days</p>
        </div>
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Pay OFFs</h3>
          <p className="text-2xl font-bold">{user.pay_offs}</p>
          <p className="text-sm">Days</p>
        </div>
      </div>

      {/* Section 2: Bar Chart & Profile */}
      <div className="grid grid-cols-2 gap-8 mb-8 max-lg:grid-cols-1">
        {/* Bar Chart */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4">Leave Overview</h3>
          <Bar data={chartData} />
        </div>

        {/* Profile Section */}
        {user ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Profile</h3>

            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <h1 className="w-full font-bold">{user.name}</h1>
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <h1 className="w-full font-bold">{user.email}</h1>
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone
              </label>
              <h1 className="w-full font-bold">{user.phone}</h1>
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                DOB
              </label>
              <h1 className="w-full font-bold">
                {user.dob ? format(user.dob, "dd-MM-yyy") : "Not Updated"}
              </h1>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="w-full"
                  onClick={() => {
                    setUpdateState(!updateState);
                    setValues(user);
                  }}
                >
                  Update Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white text-black max-sm:w-11/12">
                <DialogHeader>
                  <DialogTitle>Update Employee</DialogTitle>
                  <DialogDescription className="hidden">
                    Edit Form
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={async (e) => {
                    handleUpdate(e, user);
                  }}
                >
                  <div>
                    <Label>Name</Label>
                    <Input
                      type="text"
                      value={uName}
                      onChange={(e) => setuName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={uEmail}
                      readOnly
                      disabled
                      onChange={(e) => setuEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={uPhone}
                      onChange={(e) => setuPhone(e.target.value)}
                    />
                  </div>
                  {!user.dob && (
                    <div>
                      <Label>DOB</Label>
                      <Input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>
                  )}
                  <DialogFooter className="pt-3">
                    <DialogClose asChild>
                      <Button
                        type="submit"
                        // onClick={async () => {
                        //   await findUser();
                        // }}
                      >
                        Update
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <Skeleton className="p-2 flex flex-col gap-3 justify-center px-3">
            <Skeleton className="w-full h-20 rounded-sm" />
            <Skeleton className="w-full h-20 rounded-sm" />
            <Skeleton className="w-full h-20 rounded-sm" />
            <Skeleton className="w-full h-20 rounded-sm" />
          </Skeleton>
        )}
      </div>

      {/* Section 3: Leave Request Form */}
      <div className="grid grid-cols-2 gap-8 mb-8 max-lg:grid-cols-1">
        <div className="w-full">
          <Calendar
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            holidays={holi}
          />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 ">
          <h3 className="text-xl font-bold mb-4">Request Leave</h3>
          <form
            onSubmit={(e) => {
              setLoad(true);
              handelLeaveMail(e, user);
            }}
          >
            <div className="mb-4">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Start Date
              </label>
              <Input
                id="startDate"
                type="date"
                required
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                }}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                End Date
              </label>
              <Input
                id="endDate"
                type="date"
                required
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                }}
                className="w-full"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reason
              </label>
              <Select
                onValueChange={(value) => {
                  setLeaveType(value);
                }}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Employee ID" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Employee ID</SelectLabel>
                    <SelectItem value="casual">Casual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Reason
              </label>
              <Textarea
                id="reason"
                required
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                }}
                className="w-full"
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={load}>
              {load && (
                <span className="w-5 h-5 border-4 border-t-white border-gray-600 rounded-full animate-spin me-2"></span>
              )}
              Submit Request
            </Button>
          </form>
        </div>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default Employee;
