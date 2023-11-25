"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const [user, setUser] = useState({
    id: 0,
    username: "",
    password: "",
    email: "",
    phone: "",
    verified: false,
    suspended: false,
    forcenewpw: false,
    role: "",
  });

  useEffect(() => {
    const current_user_str = localStorage.getItem("current_user"); 
    if (current_user_str) {
      const current_user = JSON.parse(current_user_str);
      if (current_user) setUser(current_user);
    }
  }, []);

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
        <Link
          href="/create-course"
          className={`text-sm text-gray-800 transition-colors hover:text-primary ${
            pathname == "/create-course" ? "font-semibold" : ""
          }`}
        >
          Create New Course
        </Link>
      )}
    </nav>
  );
}
