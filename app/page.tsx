"use client";
import { CourseList } from "@/components/course-list";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    fetch(`${API_url}/departments`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setLoading(false);
      });
  }, []);

  if (loading === true) return <div className="flex justify-center my-80">Connecting to REST APIs...</div>;
  return (
    <>
      <MainNav />
      <div className="flex min-h-screen flex-col items-center justify-center lg:p-32 md:p-20 p-5">
        <CourseList functionality="Add Course" />
      </div>
    </>
  );
}
