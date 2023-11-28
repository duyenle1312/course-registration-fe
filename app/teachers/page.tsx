"use client";
import { UserList } from "@/components/user-list";

export default function RegisteredCourses() {
  return (
    <>
      <UserList is_teacher={true} />
    </>
  );
}
