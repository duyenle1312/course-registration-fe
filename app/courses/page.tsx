"use client";
import { CourseList } from "@/components/course-list";
import useAuth from "@/lib/useAuth";

export default function RegisteredCourses() {
  const { user } = useAuth();
  if (user?.role !== "student")
    return <div>Only Students can view this page</div>;

  return (
    <>
      <CourseList functionality="Drop Course" />
    </>
  );
}
