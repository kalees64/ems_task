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
  const [p, setP] = useState("");
  const [l, setL] = useState("");
  const [sl, setSl] = useState("");
  const [po, setPo] = useState("");

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
    fetchAtt,
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

  // Fetch user Data

  const getToken = async () => {
    const token1: any = await localStorage.getItem("token");
    const token2: any = await JSON.parse(token1);
    const token = await token2.token;
    return token;
  };

  const findUser = async () => {
    try {
      const token = await getToken();
      const res = await fetchOneData(id);
      // console.log(res);
      setUser(res);
    } catch (error: any) {
      if (error.status === 403) {
        router.push("/");
      }
    }
  };

  // get user attendance

  const getAtt = async () => {
    const res = await fetchAtt();
    const user = await fetchOneData(id);
    const res2 = res.filter((att: any) => att.emp_id === user.id);
    const present = res2.filter((att: any) => att.att === "present");
    setP(present.length);
    const leave = res2.filter((att: any) => att.att === "leave");
    setL(leave.length);
    const sLeave = res2.filter((att: any) => att.att === "s_leave");
    setSl(sLeave.length);
    const pOff = res2.filter((att: any) => att.att === "payoff");
    setPo(pOff.length);
  };

  // Bar chart data
  const chartData = {
    labels: ["Casual Leave", "Sick Leave", "Paid Leave", "Pay OFF"],
    datasets: [
      {
        label: "Leave Days",
        data: [p, l, sl, po, 30],
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

    // setValues(user);
  };
  useEffect(() => {
    startUp();
  }, [user]);
  useEffect(() => {
    // getAtt();
  }, []);
  return (
    <div className="p-6">
      {/* Logout Button */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Employee Dashboard</h1>
        <div>
          <Dialog>
            <DialogTrigger asChild>
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
                  onClick={async () => {
                    setLoad(true);
                    try {
                      const logout = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
                        {},
                        { withCredentials: true }
                      );
                      console.log(logout);
                      localStorage.removeItem("token");
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

      {/* Section 1: Leave Type Widgets */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-gray-100 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Casual Leaves</h3>
          <p className="text-2xl font-bold">{p}</p>
          <p className="text-sm">Days</p>
        </div>
        <div className="p-4 bg-gray-100 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Sick Leaves</h3>
          <p className="text-2xl font-bold">{l}</p>
          <p className="text-sm">Days</p>
        </div>
        <div className="p-4 bg-gray-100 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Paid Leaves</h3>
          <p className="text-2xl font-bold">{sl}</p>
          <p className="text-sm">Days</p>
        </div>
        <div className="p-4 bg-gray-100 shadow-md rounded-lg text-center">
          <h3 className="text-lg font-semibold">Pay OFFs</h3>
          <p className="text-2xl font-bold">{po}</p>
          <p className="text-sm">Days</p>
        </div>
      </div>

      {/* Section 2: Bar Chart & Profile */}
      <div className="grid grid-cols-2 gap-8 mb-8">
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
              <DialogContent className="bg-white">
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
      <div className="bg-white shadow-md rounded-lg p-6">
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
      <Toaster position="top-center" richColors />
    </div>
  );
};

export default Employee;
