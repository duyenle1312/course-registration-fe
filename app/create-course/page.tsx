"use client";

import { CourseInfo } from "@/components/course-info";
import useAuth from "@/lib/useAuth";

export default function CreateACourse() {
  const { user } = useAuth();
  if (user?.id === 0 || user?.role === "student")
    return <div>Only Teachers and Admin can create new course</div>;
  return (
    <CourseInfo
      title="Create a New Course"
      courseId={""}
      functionality="create"
    />
  );
}
