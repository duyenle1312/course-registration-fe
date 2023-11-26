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

const dummy_data: Courses[] = [
  {
    id: "m5gr84i9",
    instructor: "V. Levchev",
    code: "ENG 1006",
    name: "Introduction to Poetry",
    time: "TTh 1:30-3:30pm",
  },
  {
    id: "3u1reuv4",
    instructor: "N. Raychev",
    code: "COS 3015",
    name: "Software Engineering",
    time: "TTh 1:30-3:30pm",
  },
  {
    id: "derv1ws0",
    instructor: "S. Venela",
    code: "JMC 3120",
    name: "Media Law and Ethics",
    time: "TTh 1:30-3:30pm",
  },
  {
    id: "5kma53ae",
    instructor: "S. Mitreva",
    code: "COS 3100",
    name: "Programming in Python",
    time: "TF 1:30-3:30pm",
  },
  {
    id: "bhqecj4p",
    instructor: "A. Dean",
    code: "FAR 1001",
    name: "Music Theory",
    time: "TTh 1:30-3:30pm",
  },
];

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
  const [data, setCourses] = useState([]);

  useEffect(() => {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    fetch(`${API_url}/courses`, {
      next: { revalidate: 1 }, // Revalidate every second
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
        console.log(data);
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
      header: () => (
        <div className="text-left text-black font-base">Instructor</div>
      ),
      cell: ({ row }) => (
        <div className="text-sm">{row.getValue("instructor")}</div>
      ),
    },
    {
      accessorKey: "time",
      header: () => <div className="text-left text-black font-base">Time</div>,
      cell: ({ row }) => <div className="text-sm">{row.getValue("time")}</div>,
    },
    {
      accessorKey: "id",
      enableHiding: false,
      header: () => <div className=""></div>,
      cell: ({ row }) => (
        <Button variant="link" className="text-sm font-normal lg:-mx-32">
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
                      // check functionality to add or drop course then render a toast notification
                      console.log(props.functionality);
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
