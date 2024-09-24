"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DataContext from "../../../../context/DataContext";
import Link from "next/link";

const LeaveMails = () => {
  //Manage all mails state
  const [allMails, setAllMails] = useState([]);

  //Get data from context API
  const { fetchMails, router } = useContext(DataContext);

  //Get all Mails function
  const getMails = async () => {
    const res = await fetchMails();
    const res1 = res.filter((data: any) => !data.new && data.type !== "sick");
    const res2 = res1.reverse();
    setAllMails(res2);
  };

  // mail states
  const [newState, setNewState] = useState(true);

  useEffect(() => {
    getMails();
  }, [fetchMails]);
  return (
    <section className="bg-white rounded-xl shadow  p-4">
      <div className="flex gap-3 pb-2">
        <Link
          href="/admin/mails"
          className={`p-2 border rounded-md active:bg-blue-500 ${
            !newState
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
            newState
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
      <div className="w-full flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-4">Employees Leave Mails</h2>
      </div>
      <div className="w-full pt-5  max-sm:px-1 ">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#f1f5f9]">
              <TableHead className="font-bold text-black">S.No</TableHead>
              <TableHead className="font-bold text-black">
                Employee Name
              </TableHead>
              <TableHead className="font-bold text-black">
                Employee Email
              </TableHead>
              <TableHead className="font-bold text-black">
                Request From
              </TableHead>
              <TableHead className="font-bold text-black">Total Days</TableHead>
              <TableHead className="font-bold text-black">
                Responsed Date
              </TableHead>
              <TableHead className="font-bold text-black">Leave From</TableHead>
              <TableHead className="font-bold text-black">Leave To</TableHead>
              <TableHead className="font-bold text-black">
                Reason for the Leave
              </TableHead>
              <TableHead className="font-bold text-black">
                Reason for the Rejection
              </TableHead>
              <TableHead className="font-bold text-black">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-[#637085]">
            {allMails.length > 0 ? (
              allMails.map((mail: any, index: number) => {
                return (
                  <TableRow
                    key={mail.id}
                    className={`${!mail.new ? null : "hidden"}`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="text-black">{mail.name}</TableCell>
                    <TableCell>{mail.email}</TableCell>
                    <TableCell>{mail.created_date}</TableCell>
                    <TableCell>{mail.total_days}</TableCell>
                    <TableCell>{mail.modified_date}</TableCell>
                    <TableCell>{mail.leave_from}</TableCell>
                    <TableCell>{mail.leave_to}</TableCell>
                    <TableCell>{mail.reason}</TableCell>
                    <TableCell>{mail.r_reason ? mail.r_reason : "-"}</TableCell>
                    <TableCell
                      className={` ${
                        mail.status ? "text-lime-500" : "text-red-500"
                      }`}
                    >
                      {mail.status ? "Approved" : "Rejected"}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <tr>
                <TableCell>No Data</TableCell>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default LeaveMails;
