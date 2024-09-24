"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
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
import { Icon } from "@iconify/react";
import React, { useContext, useEffect, useState } from "react";
import DataContext from "../../../../context/DataContext";
import Link from "next/link";

const LeaveMails = () => {
  //Manage all Mails and new Mails States
  const [allMails, setAllMails] = useState([]);
  const [newMails, setNewMails] = useState([]);
  const [mail, setMail] = useState({});

  //Get Data from context API
  const {
    fetchMails,
    handleAprove,
    fetchOneMail,
    handleReject,
    load,
    setLoad,
    router,
  } = useContext(DataContext);

  //Get Mails function
  const getMails = async () => {
    const res = await fetchMails();
    const res2 = res.reverse();
    setAllMails(res2);
    const newMails = res.filter((data: any) => data.new);
    setNewMails(newMails);
  };

  //Get one mail function
  const getOneMail = async (id: string) => {
    const res = await fetchOneMail(id);
    setMail(res);
  };

  //Mail rejection form state
  const [reason, setReason] = useState("");

  // mail states
  const [newState, setNewState] = useState(true);

  useEffect(() => {
    getMails();
  }, [fetchOneMail]);
  return (
    <section className="bg-white rounded-xl shadow  p-4">
      <div className="flex gap-3 pb-2">
        <Link
          href="/admin/mails"
          className={`p-2 border rounded-md active:bg-blue-500 ${
            newState
              ? "bg-[#6343d8] hover:bg-[#593cc1] text-white"
              : "bg-white text-black  border border-[#6343d8]"
          }`}
          onClick={() => {
            setNewState(true);
          }}
        >
          New Mails
        </Link>
        <Link
          href="/admin/all-mails"
          className={`p-2 border rounded-md active:bg-blue-500 ${
            !newState
              ? "bg-[#6343d8] hover:bg-[#593cc1] text-white"
              : "bg-white text-black border border-[#6343d8]"
          }`}
          onClick={() => {
            setNewState(false);
          }}
        >
          All Mails
        </Link>
      </div>
      {newMails.length > 0 && (
        <div className="w-full relative">
          <div className="w-full  gap-5 items-center">
            <span className="text-lg font-semibold mb-4 pe-5">
              Employees Leave Mails
            </span>

            <Icon
              icon="clarity:new-line"
              fontSize={25}
              color="lime"
              className="animate-ping inline-block"
            />
          </div>
          <div className="w-full pt-5  max-sm:px-1  pb-4">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f1f5f9]">
                  <TableHead className="font-bold text-black">S.no</TableHead>
                  <TableHead className="font-bold text-black">
                    Employee Name
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    Employee Email
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    Request From
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    Total Days
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    Leave From
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    Leave To
                  </TableHead>
                  <TableHead className="font-bold text-black">
                    Reason for the Leave
                  </TableHead>
                  <TableHead className="font-bold text-center" colSpan={2}>
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[#637085]">
                {newMails.length > 0 ? (
                  newMails.map((mail: any, index: number) => {
                    return (
                      <TableRow
                        key={mail.id}
                        className={`${mail.new ? null : "hidden"}`}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="text-black">
                          {mail.name}
                        </TableCell>
                        <TableCell>{mail.email}</TableCell>
                        <TableCell>{mail.created_date}</TableCell>
                        <TableCell className="font-bold">
                          {mail.total_days}
                        </TableCell>
                        <TableCell>{mail.leave_from}</TableCell>
                        <TableCell>{mail.leave_to}</TableCell>
                        <TableCell>{mail.reason}</TableCell>
                        <TableCell className="flex items-center gap-3">
                          <Icon
                            icon="hugeicons:tick-04"
                            fontSize={34}
                            className="cursor-pointer"
                            onClick={() => {
                              handleAprove(mail);
                              const remain = newMails.filter(
                                (val: any) => val.id === mail.id
                              );
                              setNewMails(remain);
                            }}
                          />

                          {/* Mail Rejection form */}
                          <Dialog>
                            <DialogTrigger>
                              <Icon
                                icon="fluent:mail-dismiss-24-regular"
                                fontSize={35}
                                className="cursor-pointer "
                                onClick={async () => {
                                  await getOneMail(mail.id);
                                }}
                              />
                            </DialogTrigger>
                            <DialogContent className="bg-white text-black max-sm:w-11/12 shadow shadow-[#754ffe] border border-[#007bff]">
                              <DialogHeader>
                                <h1>Email Rejection Form</h1>
                              </DialogHeader>
                              <form
                                onSubmit={(e) => {
                                  setLoad(true);
                                  handleReject(e, mail, reason);
                                }}
                              >
                                <div>
                                  <Label className="font-bold">
                                    Employee Name
                                  </Label>
                                  <h1>{mail.name}</h1>
                                </div>
                                <div>
                                  <Label className="font-bold">
                                    Leave Reason
                                  </Label>
                                  <h1>{mail.reason}</h1>
                                </div>
                                <div>
                                  <Label className="font-bold">
                                    Leave Days
                                  </Label>
                                  <h1>{mail.total_days}</h1>
                                </div>
                                <div>
                                  <Label className="font-bold">
                                    Reason For Rejection
                                  </Label>
                                  <Input
                                    placeholder="Reason..."
                                    autoFocus
                                    type="text"
                                    required
                                    value={reason}
                                    onChange={(e) => {
                                      setReason(e.target.value);
                                    }}
                                  />
                                </div>
                                <DialogFooter className="pt-3">
                                  <Button
                                    type="submit"
                                    disabled={load}
                                    className="bg-[#754ffe] hover:bg-[#6f42c1]"
                                  >
                                    {load && (
                                      <span className="w-5 h-5 border-4 border-t-white border-gray-600 rounded-full animate-spin me-2 "></span>
                                    )}
                                    Send
                                  </Button>
                                </DialogFooter>
                              </form>
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
          </div>
        </div>
      )}
      {newMails.length === 0 && (
        <div className="w-full flex justify-between items-center">
          <h1 className="text-2xl font-bold">No Mails...</h1>
        </div>
      )}
    </section>
  );
};

export default LeaveMails;
