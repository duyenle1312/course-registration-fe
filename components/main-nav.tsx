"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  console.log(pathname);
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
        All Courses
      </Link>
      <Link
        href="/courses"
        className={`text-sm text-gray-800 transition-colors hover:text-primary ${
          pathname == "/courses" ? "font-semibold" : ""
        }`}
      >
        Registered Course
      </Link>
      <Link
        href="/create-course"
        className={`text-sm text-gray-800 transition-colors hover:text-primary ${
          pathname == "/create-course" ? "font-semibold" : ""
        }`}
      >
        Create New Course
      </Link>
    </nav>
  );
}
