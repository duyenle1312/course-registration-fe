"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import useAuth from "@/lib/useAuth";

const viewComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Registered Courses",
    href: "/courses",
    description: "All enrolled courses from a student",
  },
  {
    title: "All Users",
    href: "/users",
    description: "View all user types and assign role",
  },
  {
    title: "All Teachers",
    href: "/teachers",
    description: "Displays all teacher accounts",
  },
  {
    title: "All Departments",
    href: "/departments",
    description: "All departments created in the system",
  },
];

const createComponents: { title: string; href: string; description: string }[] =
  [
    {
      title: "Create Admin",
      href: "/admin-register",
      description: "Create admin accounts",
    },
    {
      title: "Create New Course",
      href: "/create-course",
      description: "Only for Teachers and Admin",
    },
    {
      title: "Create New Department",
      href: "/create-dep",
      description: "Create new department, only for admin",
    },
    {
      title: "Create User",
      href: "/register",
      description: "Create accounts for students and teachers",
    },
  ];

export function Menu() {
  const { user } = useAuth();
  return (
    <NavigationMenu className="w-full">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              AUBG Courses
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>View Information</NavigationMenuTrigger>
          <NavigationMenuContent className="z-50">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {viewComponents.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {(user?.id !== 0 && user?.role !== "student") && (
          <NavigationMenuItem>
            <NavigationMenuTrigger>Create New</NavigationMenuTrigger>
            <NavigationMenuContent className="z-50">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {createComponents.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
