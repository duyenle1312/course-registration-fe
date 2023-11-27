"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import useAuth from "@/lib/useAuth";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export default function CourseDetails(props: any) {
  const courseId = props?.params?.courseId;
  const { user } = useAuth();
  const router = useRouter()

  async function enrollCourse() {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const res = await fetch(`${API_url}/enroll/${courseId}`, {
        method: "POST",
        headers: {
          login_email: user.email,
          login_password: user.password,
        },
      });
      const data = await res.json();
      console.log(data);
      console.log(res.status);
      if (res.status === 200) {
        toast({
          description: "Successfully enroll in this course",
        });
      } else {
        toast({
          description: data.error
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteCourse() {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const res = await fetch(`${API_url}/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          login_email: user.email,
          login_password: user.password,
        },
      });
      const data = await res.json();
      // console.log(data);
      // console.log(res.status);
      if (res.status === 200) {
        toast({
          title: data.message,
        });
        router.push("/")
      } else {
        toast({
          description: data.error
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  const [loading, setLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState({
    id: 0,
    name: "",
    code: "",
    teacher_id: 0,
    instructor: "",
    instructor_email: "",
    description: "",
    credits: 3,
    timeslots: "",
  });

  useEffect(() => {
    const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
    let teachers_data: any[] = [];

    // Get all teachers
    fetch(`${API_url}/teachers`, {
      next: { revalidate: 1 }, // Revalidate every second
    })
      .then((res) => res.json())
      .then((data) => {
        teachers_data = data;
        // Get course details
        fetch(`${API_url}/courses/${courseId}`, {
          next: { revalidate: 1 }, // Revalidate every second
        })
          .then((res) => res.json())
          .then((data) => {
            const teacher: any = teachers_data.filter(
              (teacher) => teacher["id"] === data[0].teacher_id
            );
            const course = {
              id: data[0].id,
              teacher_id: data[0].teacher_id,
              instructor: teacher[0]["username"],
              instructor_email: teacher[0]["email"],
              name: data[0].course,
              code: data[0].course_nr,
              description: data[0].description,
              credits: data[0].cr_cost,
              timeslots: data[0].timeslots,
            };
            setCourseDetails(course);
            setLoading(false);
          });
      });
  }, [courseId]);

  if (loading === true) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>{courseDetails?.name}</CardTitle>
          <CardDescription>Course ID: {courseDetails?.code}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <div className="mb-4 items-start pb-4 last:mb-0 last:pb-0">
              <div className="my-3">
                <p className="text-sm font-medium leading-none my-3">Time: </p>
                <p className="text-sm text-black">{courseDetails?.timeslots}</p>
              </div>
              <div className="my-3">
                <p className="text-sm font-medium leading-none my-3">
                  Instructor:{" "}
                </p>
                <p className="text-sm text-black">
                  {courseDetails?.instructor} ({courseDetails?.instructor_email}
                  )
                </p>
              </div>
              <div className="my-3">
                <p className="text-sm  leading-none my-3">
                  <span className="font-medium">Credits: </span>
                  {courseDetails?.credits}
                </p>
              </div>
              <div className="my-3">
                <p className="text-sm  leading-none my-3">
                  <span className="font-medium">Enrollments: </span> 12/30
                </p>
              </div>
              <div className="my-3">
                <p className="text-sm font-medium leading-none my-3">
                  Description:
                </p>
                <p className="text-sm text-black">
                  {courseDetails?.description}
                </p>
              </div>
              <div className="my-3">
                <p className="text-sm font-medium leading-none my-3">
                  Location:{" "}
                </p>
                <p className="text-sm text-black">Main Building</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex space-x-3">
          {user?.role === "student" && (
            <Button onClick={enrollCourse} className="px-6 bg-green-700 text-white">Enroll</Button>
          )}
          {(user?.role === "admin" || courseDetails.teacher_id == user?.id) && (
            <>
              <Link href={`/edit-course/${courseId}`}>
                <Button className="px-6 bg-blue-700 hover:bg-blue-600">
                  Edit Courses
                </Button>
              </Link>
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="px-6 bg-red-600 hover:bg-red-700">
                    Delete Course
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-68">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">
                        This action cannot be recovered
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Do you want to delete this course?
                      </p>
                    </div>
                    <div className="w-full">
                      <Button
                        onClick={deleteCourse}
                        className="w-full bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
