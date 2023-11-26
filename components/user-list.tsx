"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import useAuth from "@/lib/useAuth";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export type Users = {
  id: number;
  username: string;
  password: string;
  email: string;
  phone: string;
  verified: boolean;
  suspended: boolean;
  forcenewpw: boolean;
  role: string;
};

export function UserList() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setUsers] = useState([]);

  useEffect(() => {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    fetch(`${API_url}/users`, {
      next: { revalidate: 1 }, // Revalidate every second
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
        // console.log(data);
      });
  }, []);

  async function assignRole(target_id: number, role: string) {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const res = await fetch(`${API_url}/admin/users/${target_id}`, {
        method: "PATCH",
        headers: {
          login_email: user?.email || "",
          login_password: user?.password || "",
          id: target_id.toString(),
          role: role,
        },
      });
      const data = await res.json();
      if (res.status === 200) {
        toast({
          description: "Update Role Successfully",
        });
        window.location.reload(); // reload to fetch new data again
      } else {
        toast({
          description: data.error,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Users>[] = [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <div className="text-left -ml-4">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="text-black font-base">ID</span>
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize text-sm">{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <div className="text-left -ml-4">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <span className="text-black font-base">Name</span>
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("username")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: () => <div className="text-left text-black font-base">Email</div>,
      cell: ({ row }) => <div className="text-sm">{row.getValue("email")}</div>,
    },
    {
      accessorKey: "role",
      header: () => <div className="text-left text-black font-base">Role</div>,
      cell: ({ row }) => (
        <div className="text-sm capitalize">{row.getValue("role")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  assignRole(user?.id, "admin");
                }}
              >
                Assign as Admin
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  assignRole(user?.id, "teacher");
                }}
              >
                Assign as Teacher
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  assignRole(user?.id, "student");
                }}
              >
                Assign as Student
              </DropdownMenuItem>
              <DropdownMenuItem>Update</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (user?.role !== "admin" && loading === false)
    return <div>Only Admin can view this page</div>;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Find name..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-xs mr-5"
        />
        <Input
          placeholder="Find email..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filter <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id != "username" ? column.id : "Name"}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
