"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAuth from "@/lib/useAuth";
import { useEffect, useState } from "react";

export default function Departments() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<any[]>([]);
  useEffect(() => {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    fetch(`${API_url}/departments`, {
      method: "GET",
      headers: {
        login_email: user.email,
        login_password: user.password,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setDepartments(data);
      });
  }, [user]);

  return (
    <div className="flex flex-col w-full justify-center items-center">
      <h1 className="lg:text-2xl md:text-xl text-lg my-8 font-medium">All AUBG Departments</h1>
      <div className="lg:w-1/3 md:w-2/3 w-full">
        <ScrollArea className="h-96 w-full">
          <Table className="w-full border-[1px] border-muted-ground rounded-lg">
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">ID</TableHead>
                <TableHead>Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department?.id}>
                  <TableCell className="font-medium">
                    {department?.id}
                  </TableCell>
                  <TableCell className="font-medium">
                    {department?.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
