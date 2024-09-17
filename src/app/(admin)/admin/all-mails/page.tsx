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

const LeaveMails = () => {
  //Manage all mails state
  const [allMails, setAllMails] = useState([]);

  //Get data from context API
  const { fetchMails } = useContext(DataContext);

  //Get all Mails function
  const getMails = async () => {
    const res = await fetchMails();
    let res1 = res.filter((data: any) => !data.new);
    let res2 = res1.reverse();
    setAllMails(res2);
  };

  useEffect(() => {
    getMails();
  }, [allMails]);
  return (
    <section className="bg-white shadow-md rounded p-4">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-lg font-semibold mb-4">Employees Leave Mails</h2>
      </div>
      <div className="w-full pt-5 px-6 max-sm:px-1 max-sm:overflow-x-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Employee Name</TableHead>
              <TableHead>Employee Email</TableHead>
              <TableHead>Request From</TableHead>
              <TableHead>Total Days</TableHead>
              <TableHead>Responsed Date</TableHead>
              <TableHead>Leave From</TableHead>
              <TableHead>Leave To</TableHead>
              <TableHead>Reason for the Leave</TableHead>
              <TableHead>Reason for the Rejection</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allMails.length > 0 ? (
              allMails.map((mail: any, index: number) => {
                return (
                  <TableRow
                    key={mail.id}
                    className={`${!mail.new ? null : "hidden"}`}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{mail.name}</TableCell>
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
