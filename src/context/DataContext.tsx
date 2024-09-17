"use client";
import axios from "axios";
import { differenceInDays, format } from "date-fns";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useState } from "react";
import { toast } from "sonner";

const DataContext = createContext({});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // API UTL
  const API_URI = "http://localhost:3000";
  const router = useRouter();

  // User Login Details
  const [ulPhone, setulPhone] = useState("");
  const [ulPass, setulPass] = useState("");

  // User details for Update
  const [uName, setuName] = useState("");
  const [uEmail, setuEmail] = useState("");
  const [uPhone, setuPhone] = useState("");

  // Update form popup state
  const [updateState, setUpdateState] = useState(false);

  // ADD / Register Employee Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [adminState, setAdminState] = useState(false);

  // Leave mail Request Details
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [reject, setReject] = useState(false);

  //Data Fetching Function -- ALL User Data
  const fetchData = async () => {
    const res = await axios.get(`${API_URI}/employees`);
    // console.log(res.data);
    return res.data;
  };

  //Data Fetching Function -- ALL User Data
  const fetchOneData = async (id: string) => {
    const res = await axios.get(`${API_URI}/employees/${id}`);
    // console.log(res.data);
    return res.data;
  };

  // Leave Mail Fetching all
  const fetchMails = async () => {
    const res = await axios.get(`${API_URI}/leavemails`);
    // console.log(res.data);
    return res.data;
  };

  // Leave Mail Fetching one
  const fetchOneMail = async (id: string) => {
    const res = await axios.get(`${API_URI}/leavemails/${id}`);
    // console.log(res.data);
    return res.data;
  };

  // Attendance fetching all
  const fetchAtt: any = async () => {
    const res = await axios.get(`${API_URI}/attendances`);
    return res.data;
  };

  // Attendance fetching One
  const fetchOneAtt = async (id: string) => {
    const res = await axios.get(`${API_URI}/attendances/${id}`);
    return res.data;
  };

  // Login Function
  const handleLogin: any = async (e: any) => {
    e.preventDefault();
    if (ulPhone === "9786935749" && ulPass === "admin@spinsoft") {
      setTimeout(() => {
        toast.success(`Welcome Admin`);
      }, 100);
      setulPhone("");
      setulPass("");
      return router.push("/admin");
    }
    let allData = await fetchData();
    let userData = allData.find(
      (data: any) => data.phone === ulPhone && data.password === ulPass
    );
    setulPhone("");
    setulPass("");
    if (!userData) {
      return setTimeout(() => {
        toast.error("No User Found");
      }, 100);
    }
    setTimeout(() => {
      toast.success(`Welcome ${userData.name}`);
    }, 100);
    router.push(`/employee/${userData.id}`);
    // console.log(allData);
  };

  // Update user Function
  const handleUpdate = async (e: any, user: any) => {
    e.preventDefault();
    const newData = {
      id: user.id,
      name: uName ? uName : user.name,
      email: uEmail ? uEmail : user.email,
      phone: uPhone ? uPhone : user.phone,
      password: user.password,
    };
    const res = await axios.put(`${API_URI}/employees/${user.id}`, newData);
    // console.log(res);
    // setUpdateState(!updateState);
    setTimeout(() => {
      toast.success("Employee Updated");
    }, 100);
    setuEmail("");
    setuName("");
    setuPhone("");
  };

  // Regiser / Add user Function
  const handleRegister = async (e: any) => {
    e.preventDefault();
    const allUsers = await fetchData();
    const res = await axios.post(`${API_URI}/employees`, {
      name,
      email,
      phone,
      password,
    });
    const user = res.data;
    if (adminState) {
      setAdminState(!adminState);
      setTimeout(() => {
        toast.success("Employee Added");
      }, 100);
      return router.push("/admin");
    }
    setTimeout(() => {
      toast.success(`Welcome ${user.name}`);
    }, 100);
    router.push(`/employee/${user.id}`);
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
  };

  // Delete User Function
  const handleDelete = async (id: string) => {
    const res = await axios.delete(`${API_URI}/employees/${id}`);
    setTimeout(() => {
      toast.error("Employee Deleted");
    }, 100);
    // console.log(res.data);
  };

  // Leave Mail Request Function
  const handelLeaveMail = async (e: any, user: any) => {
    e.preventDefault();
    let fromDate = format(from, "dd/MM/yyyy");
    let toDate = format(to, "dd/MM/yyyy");
    let days = differenceInDays(new Date(to), new Date(from));
    const res = await axios.post(`${API_URI}/leavemails`, {
      emp_id: user.id,
      name: user.name,
      email: user.email,
      leave_from: fromDate,
      leave_to: toDate,
      reason: reason,
      new: true,
      created_date: format(new Date(), "dd/MM/yyy"),
      modified_date: format(new Date(), "dd/MM/yyy"),
      total_days: differenceInDays(new Date(to), new Date(from)),
    });
    // console.log(days);
    setTimeout(() => {
      toast.success("Mail sent");
    }, 100);
    setFrom("");
    setTo("");
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
    const res = await axios.put(`${API_URI}/leavemails/${mail.id}`, updateMail);
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
    const res = await axios.put(`${API_URI}/leavemails/${mail.id}`, updateMail);
    setReject(!reject);
    setTimeout(() => {
      toast.error(`Mail Rejected for ${mail.name}`);
    }, 100);
    // console.log(res.data);
  };

  return (
    <DataContext.Provider
      value={{
        API_URI,
        handleLogin,
        ulPhone,
        setulPhone,
        ulPass,
        setulPass,
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
        name,
        setName,
        email,
        setEmail,
        phone,
        setPhone,
        handleRegister,
        password,
        setPassword,
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
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;
