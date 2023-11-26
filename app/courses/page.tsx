"use client";
import { CourseList } from "@/components/course-list";
import useAuth from "@/lib/useAuth";

async function getRegisteredCourses() {
  const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log(API_url);
  try {
    const res = await fetch(`${API_url}/api/health_checker`);
    console.log(res);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

export default function RegisteredCourses() {
  const { user } = useAuth();

  // const data = await getRegisteredCourses();

  if (user?.role !== "student")
    return <div>Only Students can view this page</div>;

  return (
    <>
      <CourseList role="student" functionality="Drop Course" />
    </>
  );
}
