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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { useEffect, useState } from "react";
import { toast } from "./ui/use-toast";

export type Courses = {
  id: string;
  instructor: string;
  code: string;
  name: string;
  time: string;
};

interface Props {
  role: string;
  functionality: string;
}

export function CourseList(props: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setCourses] = useState<any[]>([]);

  async function enrollCourse(courseId: string, course_name: string) {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const res = await fetch(`${API_url}/enroll/${courseId}`, {
        method: "POST",
        headers: {
          login_email: user.email,
          login_password: user.password,
        },
      });
      const data = await res.json();
      // console.log(data);
      // console.log(res.status);
      if (res.status === 200) {
        toast({
          description: `Successfully enroll in ${course_name}`,
        });
      } else {
        toast({
          description: data.error,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    let teachers_data: any[] = [];

    // Get all teachers
    fetch(`${API_url}/teachers`, {
      next: { revalidate: 1 }, // Revalidate every second
    })
      .then((res) => res.json())
      .then((data) => {
        teachers_data = data;

        // Get all courses
        fetch(`${API_url}/courses`, {
          next: { revalidate: 1 }, // Revalidate every second
        })
          .then((res) => res.json())
          .then((data) => {
            let courses: any[] = [];
            data.forEach((x: any, i: any) => {
              // Get teacher name from teacher_id provided by the course object
              const teacher = teachers_data.filter(
                (teacher) => teacher["id"] === x.teacher_id
              );
              courses.push({
                id: x.id || "",
                instructor: teacher[0]?.username,
                code: x.course_nr || "",
                name: x.course || "",
                time: x.timeslots || "",
              });
            });
            setCourses(courses);
            setLoading(false);
          });
      });
  }, []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns: ColumnDef<Courses>[] = [
    {
      accessorKey: "code",
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
        <div className="capitalize text-sm">{row.getValue("code")}</div>
      ),
    },
    {
      accessorKey: "name",
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
      cell: ({ row }) => <div className="text-sm">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "instructor",
      header: ({ column }) => (
        <div className="text-left -ml-4">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="text-black font-base">Instructor</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("instructor")}</div>
      ),
    },
    {
      accessorKey: "time",
      header: ({ column }) => (
        <div className="text-left -ml-4">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <span className="text-black font-base">Time</span>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ),
      cell: ({ row }) => <div className="text-sm">{row.getValue("time")}</div>,
    },
    {
      accessorKey: "id",
      enableHiding: false,
      header: () => <div className=""></div>,
      cell: ({ row }) => (
        <Button variant="link" className="text-sm font-normal ">
          <Link href={`/course/${row.getValue("id")}`}>View Details</Link>
        </Button>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const course = row.original;

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
                onClick={() => navigator.clipboard.writeText(course.code)}
              >
                Copy Course ID
              </DropdownMenuItem>
              {user?.id !== 0 && user?.role !== "admin" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      enrollCourse(course.id, course.name);
                    }}
                  >
                    {props.functionality}
                  </DropdownMenuItem>
                </>
              )}
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

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter department..."
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("code")?.setFilterValue(event.target.value)
          }
          className="max-w-xs mr-5"
        />
        <Input
          placeholder="Find course name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-xs mr-5"
        />
        <Input
          placeholder="Find instructor..."
          value={
            (table.getColumn("instructor")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("instructor")?.setFilterValue(event.target.value)
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
                    {column.id != "code" ? column.id : "ID"}
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
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}
    </div>
  );
}
