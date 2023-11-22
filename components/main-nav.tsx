import Link from "next/link"

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/"
        className="text-sm font-medium text-gray-800 transition-colors hover:text-primary"
      >
        All Courses
      </Link>
      <Link
        href="/courses"
        className="text-sm font-medium text-gray-800 transition-colors hover:text-primary"
      >
        Registered Course
      </Link>
      {/* <Link
        href="/profile"
        className="text-sm font-medium text-gray-800 transition-colors hover:text-primary"
      >
        Settings
      </Link> */}
    </nav>
  )
}