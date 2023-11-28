"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import useAuth from "@/lib/useAuth";
import { Menu } from "./menu";
import { UserNav } from "./user-nav";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <>
      <div className="z-50 flex py-3 px-8 w-full fixed bg-white rounded drop-shadow-sm">
        <div className="flex w-full justify-center items-center">
          <Menu />
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </>
  );
}
