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

const LeaveMails = () => {
  //Manage all Mails and new Mails States
  const [allMails, setAllMails] = useState([]);
  const [newMails, setNewMails] = useState([]);
  const [mail, setMail] = useState({});

  //Get Data from context API
  const {
    fetchMails,
    handleAprove,
    reject,
    setReject,
    fetchOneMail,
    handleReject,
  } = useContext(DataContext);

  //Get Mails function
  const getMails = async () => {
    const res = await fetchMails();
    let res2 = res.reverse();
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

  useEffect(() => {
    getMails();
  }, [allMails]);
  return (
    <section className="bg-white shadow-md rounded p-4">
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
          <div className="w-full pt-5 px-6 max-sm:px-1 max-sm:overflow-x-scroll pb-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>S.no</TableHead>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Employee Email</TableHead>
                  <TableHead>Request From</TableHead>
                  <TableHead>Total Days</TableHead>
                  <TableHead>Leave From</TableHead>
                  <TableHead>Leave To</TableHead>
                  <TableHead>Reason for the Leave</TableHead>
                  <TableHead colSpan={2} className="text-center">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {newMails.length > 0 ? (
                  newMails.map((mail: any, index: number) => {
                    return (
                      <TableRow
                        key={mail.id}
                        className={`${mail.new ? null : "hidden"}`}
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{mail.name}</TableCell>
                        <TableCell>{mail.email}</TableCell>
                        <TableCell>{mail.created_date}</TableCell>
                        <TableCell className="font-bold">
                          {mail.total_days}
                        </TableCell>
                        <TableCell>{mail.leave_from}</TableCell>
                        <TableCell>{mail.leave_to}</TableCell>
                        <TableCell>{mail.reason}</TableCell>
                        <TableCell>
                          <Icon
                            icon="hugeicons:tick-04"
                            fontSize={34}
                            color="white"
                            className="p-1 bg-lime-600 rounded "
                            onClick={() => {
                              handleAprove(mail);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {/* Mail Rejection form */}
                          <Dialog>
                            <DialogTrigger>
                              <Icon
                                icon="material-symbols:close-small-rounded"
                                fontSize={35}
                                className="p-1 bg-red-600 rounded "
                                onClick={async () => {
                                  await getOneMail(mail.id);
                                }}
                              />
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                              <DialogHeader>
                                <h1>Email Rejection Form</h1>
                              </DialogHeader>
                              <form
                                onSubmit={(e) => {
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
                                  <Button type="submit">Send</Button>
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
