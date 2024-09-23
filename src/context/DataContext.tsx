"use client";
import axios from "axios";
import {
  differenceInDays,
  format,
  isBefore,
  isEqual,
  parseISO,
  startOfDay,
} from "date-fns";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useState } from "react";
import { toast } from "sonner";

const DataContext = createContext<any>({});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Router initialization
  const router = useRouter();

  // User details for Update
  const [uName, setuName] = useState("");
  const [uEmail, setuEmail] = useState("");
  const [uPhone, setuPhone] = useState("");
  const [dob, setDob] = useState("");

  //Birthday Boy
  const [birUser, setBirUser] = useState([]);

  // Update form popup state
  const [updateState, setUpdateState] = useState(false);

  // ADD / Register Employee Details
  const [adminState, setAdminState] = useState(false);

  // Loading Button State
  const [load, setLoad] = useState(false);

  // Sidebar State
  const [side, setSide] = useState(false);

  // Leave mail Request Details
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [reject, setReject] = useState(false);

  //Data Fetching Function -- ALL User Data
  const fetchData = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/users`
    );
    // console.log(res.data);
    return res.data;
  };

  //Get token from localstorage
  const getToken = async () => {
    const token1: any = localStorage.getItem("token");
    const token2: any = await JSON.parse(token1);
    const token = await token2.token;
    return token;
  };

  //Data Fetching Function -- ALL User Data
  const fetchOneData = async (id: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/users/${id}`
      );
      console.log(res.data);
      return res.data;
    } catch (error: any) {
      if (error.status === 403) {
        // router.push("/");
      }
    }
  };

  // Leave Mail Fetching all
  const fetchMails = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/leavemails`
    );
    // console.log(res.data);
    return res.data;
  };

  // Leave Mail Fetching one
  const fetchOneMail = async (id: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/leavemails/${id}`
    );
    // console.log(res.data);
    return res.data;
  };

  // Attendance fetching all
  const fetchAtt = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/attendances`
    );
    return res.data;
  };

  // Attendance fetching One
  const fetchOneAtt = async (id: string) => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/attendances/${id}`
    );
    return res.data;
  };

  // Get All Holidays List
  const fetchHolidays = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/holidays`
    );
    return res.data;
  };

  //Login Fuction
  const handleLogin = async (data: any) => {
    try {
      // const res = await axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      //   data,
      //   {
      //     withCredentials: true,
      //   }
      // );
      // const userData = res.data.data.user;
      // localStorage.setItem("token", JSON.stringify(res.data.data));
      const res = await fetchData();
      const userData = res.find(
        (user: any) =>
          user.email === data.email && user.password === data.password
      );
      setLoad(false);
      if (userData) {
        setTimeout(() => {
          toast.success(`Welcome ${userData.name}`);
        }, 100);
      }
      console.log(userData);
      if (userData.role.type === "employee") {
        return router.push(`/employee/${userData.id}`);
      } else {
        return router.push(`/admin`);
      }
    } catch (error: any) {
      setLoad(false);
      return setTimeout(() => {
        toast.error(`Invalid Email & Password`);
      }, 100);
    }
  };

  // Regiser / Add user Function
  const handleRegister = async (data: any) => {
    // 4d837ae0-7ed2-49e4-bebd-cab50a79bde3
    try {
      const allData = await fetchData();
      const phoneNumber = "+91-" + data.phone;
      const userData = allData.find(
        (user: any) => user.email === data.email || user.phone === phoneNumber
      );
      if (userData) {
        setLoad(false);
        return setTimeout(() => {
          toast.error("Employee Already Found");
        }, 100);
      }
    } catch (error: any) {
      setLoad(false);
      return setTimeout(() => {
        toast.error(error.message);
      }, 100);
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/users`,
        {
          name: data.name,
          email: data.email,
          phone: data.phone ? "+91-" + data.phone : "",
          password: data.password,
          role: { type: "employee", title: "Employee" },
          total_leaves: 36,
          pending_leaves: 36,
          casual_leaves: 0,
          sick_leaves: 0,
          paid_leaves: 0,
          pay_offs: 0,
        }
      );
      const user = res.data;
      // console.log(user);
      if (adminState) {
        setAdminState(!adminState);
        setLoad(false);
        setTimeout(() => {
          toast.success("Employee Added");
        }, 100);
        return router.push("/admin/employees");
      }
      // const res1 = await axios.post(
      //   `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
      //   {
      //     email: data.email,
      //     password: data.password,
      //   }
      // );
      // const userData = res1.data.data.user;
      // localStorage.setItem("token", JSON.stringify(res.data.data));
      setLoad(false);
      setTimeout(() => {
        toast.success(`Welcome ${user.name}`);
      }, 100);
      if (user.role.type === "employee") {
        return router.push(`/employee/${user.id}`);
      } else {
        return router.push(`/admin`);
      }
    } catch (error) {
      setLoad(false);
      return setTimeout(() => {
        toast.error("Employee Not Added - Server Error");
      }, 100);
    }
  };

  // Update user Function
  const handleUpdate = async (e: any, user: any) => {
    e.preventDefault();
    try {
      const newData = {
        id: user.id,
        name: uName,
        email: uEmail,
        phone: uPhone,
        password: user.password,
        dob: dob ? dob : user.dob,
        ...user,
      };

      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/users/${user.id}`,
        newData
      );

      // console.log(res);
      // setUpdateState(!updateState);
      setTimeout(() => {
        toast.success("Employee Updated");
      }, 100);
      setuEmail("");
      setuName("");
      setuPhone("");
      setDob("");
    } catch (error: any) {
      setTimeout(() => {
        toast.error(error.message);
      }, 100);
    }
  };

  // Delete User Function
  const handleDelete = async (id: string) => {
    try {
      const res = await axios.delete(
        `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/users/${id}`
      );
      setTimeout(() => {
        toast.success("Employee Deleted");
      }, 100);
      return true;
    } catch (error: any) {
      setTimeout(() => {
        toast.error(error.message);
      }, 100);
      return false;
    }
  };

  // Leave Mail Request Function
  const handelLeaveMail = async (e: any, user: any) => {
    e.preventDefault();
    const days = differenceInDays(new Date(to), new Date(from));
    const allMails = await fetchMails();
    const checkTo = parseISO(to);
    const checkFrom = parseISO(from);
    if (isBefore(checkTo, checkFrom)) {
      setLoad(false);
      return setTimeout(() => {
        toast.error("End date is not before than start date");
      }, 100);
    }
    const fromDate = format(from, "dd/MM/yyyy");
    const toDate = format(to, "dd/MM/yyyy");

    const userMail = allMails.find(
      (mail: any) => mail.leave_from === fromDate && mail.leave_to === toDate
    );
    if (userMail) {
      setFrom("");
      setTo("");
      setReason("");
      setLoad(false);
      setLeaveType("");
      return setTimeout(() => {
        toast.error("This leave already applied");
      }, 100);
    }

    if (user.pending_leaves <= 12) {
      setLoad(false);
      return setTimeout(() => {
        toast.error(
          "Your Casual and Sick Leaves are empty, you can apply for the PAID LEAVE via Email"
        );
      });
    }

    if (leaveType === "casual" && user.casual_leaves <= 0) {
      setLoad(false);
      return setTimeout(() => {
        toast.error("Your Casual Leave is empty");
      });
    }

    if (leaveType === "casual" && user.casual_leaves < days) {
      setLoad(false);
      return setTimeout(() => {
        toast.error(`Your Remaining Casual Leaves are less than ${days}`);
      });
    }

    if (leaveType === "sick" && user.sick_leaves <= 0) {
      setLoad(false);
      return setTimeout(() => {
        toast.error("Your Sick Leave is empty");
      });
    }

    if (leaveType === "sick" && user.sick_leaves <= days) {
      setLoad(false);
      return setTimeout(() => {
        toast.error(`Your Remaining Sick Leaves are less than ${days}`);
      });
    }

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/leavemails`,
      {
        emp_id: user.id,
        name: user.name,
        email: user.email,
        leave_from: fromDate,
        leave_to: toDate,
        reason: reason,
        new: leaveType === "sick" ? false : true,
        type: leaveType,
        created_date: format(new Date(), "dd/MM/yyy"),
        modified_date: format(new Date(), "dd/MM/yyy"),
        total_days: differenceInDays(new Date(to), new Date(from)),
      }
    );
    // console.log(days);
    if (leaveType === "sick") {
      const userUpdate = await axios.put(
        `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/users/${user.id}`,
        {
          ...user,
          pending_leaves: user.pending_leaves - days,
          sick_leaves: user.sick_leaves - days,
        }
      );
    }
    setTimeout(() => {
      toast.success("Mail sent");
    }, 100);
    setLoad(false);
    setFrom("");
    setTo("");
    setLeaveType("");
    setReason("");
  };

  // Leave Approval Function
  const handleAprove = async (mail: any) => {
    const updateMail = {
      ...mail,
      status: true,
      new: false,
      modified_date: format(new Date(), "dd/MM/yyy"),
    };
    const fetchUser = await fetchOneData(mail.emp_id);
    console.log(mail);
    console.log(fetchUser);
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/leavemails/${mail.id}`,
      updateMail
    );
    const newData = {
      ...fetchUser,
      pending_leaves:
        Number(fetchUser.pending_leaves) - Number(mail.total_days),
      casual_leaves: Number(fetchUser.casual_leaves) - Number(mail.total_days),
    };
    const updateUser = await axios.put(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/users/${fetchUser.id}`,
      newData
    );

    setTimeout(() => {
      toast.success(`Mail Approved for ${mail.name}`);
    }, 100);
    // console.log(res.data);
  };

  // Leave Approval Function
  const handleReject = async (e: any, mail: any, reason: string) => {
    e.preventDefault();
    const updateMail = {
      ...mail,
      status: false,
      r_reason: reason,
      new: false,
      modified_date: format(new Date(), "dd/MM/yyy"),
    };
    const res = await axios.put(
      `${process.env.NEXT_PUBLIC_JSON_SERVER_API_URL}/leavemails/${mail.id}`,
      updateMail
    );
    setReject(!reject);
    setLoad(false);
    setTimeout(() => {
      toast.error(`Mail Rejected for ${mail.name}`);
    }, 100);
    // console.log(res.data);
  };

  // Get birthday boy/girl
  const getBirthDay = async () => {
    const all = await fetchData();
    const date = new Date();
    const day = date.getDate().toString();
    const toDay = day.length < 2 ? "0" + day : day;
    const month = Number(date.getMonth()) + 1;
    const month1 = month.toString();
    const toMonth = month1.length < 2 ? "0" + month1 : month1;
    const findUser = all.filter((user: any) => {
      try {
        const userMonth = user.dob.slice(5, 7);
        const userDay = user.dob.slice(8);
        if (userMonth == toMonth && userDay == toDay) {
          return user;
        }
      } catch (error) {
        return null;
      }
    });
    setBirUser(findUser);
  };

  return (
    <DataContext.Provider
      value={{
        handleLogin,

        fetchOneData,
        uName,
        setuName,
        uEmail,
        setuEmail,
        uPhone,
        setuPhone,
        handleUpdate,
        updateState,
        setUpdateState,

        fetchData,
        handleDelete,
        router,
        adminState,
        setAdminState,
        fetchMails,
        from,
        setFrom,
        to,
        setTo,
        reason,
        setReason,
        handelLeaveMail,
        handleAprove,
        handleReject,
        reject,
        setReject,
        fetchOneMail,
        fetchAtt,
        fetchOneAtt,
        fetchHolidays,
        handleRegister,
        load,
        setLoad,
        leaveType,
        setLeaveType,
        dob,
        setDob,
        getBirthDay,
        birUser,
        setBirUser,
        side,
        setSide,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
