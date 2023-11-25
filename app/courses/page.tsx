"use client";
import { CourseList } from "@/components/course-list";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { useEffect, useState } from "react";
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

  // const data = await getRegisteredCourses();

  if (user?.role !== "student")
    return <div>Only Students can view this page</div>;

  return (
    <>
      <CourseList role="student" functionality="Drop Course" />
    </>
  );
}
