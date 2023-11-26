"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import useAuth from "@/lib/useAuth";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <nav
      className={cn("flex items-center space-x-5 lg:space-x-8", className)}
      {...props}
    >
      <Link
        href="/"
        className={`text-sm text-gray-800 transition-colors hover:text-primary ${
          pathname == "/" ? "font-semibold" : ""
        }`}
      >
        AUBG Courses
      </Link>
      {user?.id !== 0 && user?.role !== "admin" && (
        <Link
          href="/courses"
          className={`text-sm text-gray-800 transition-colors hover:text-primary ${
            pathname == "/courses" ? "font-semibold" : ""
          }`}
        >
          Registered Course
        </Link>
      )}
      {user?.role === "admin" && (
        <>
          <Link
            href="/users"
            className={`text-sm text-gray-800 transition-colors hover:text-primary ${
              pathname == "/users" ? "font-semibold" : ""
            }`}
          >
            All Users
          </Link>
          <Link
            href="/create-course"
            className={`text-sm text-gray-800 transition-colors hover:text-primary ${
              pathname == "/create-course" ? "font-semibold" : ""
            }`}
          >
            Create New Course
          </Link>
        </>
      )}
    </nav>
  );
}
