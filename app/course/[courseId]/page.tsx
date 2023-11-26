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
import useAuth from '@/lib/useAuth';

async function getCourseDetails() {
  const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log(API_url);
  try {
    const res = await fetch(`${API_url}/courses/id/${12}`);
    console.log(res);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

async function enrollACourse() {
  const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log(API_url);
  try {
    const res = await fetch(`${API_url}/enroll/${12}`);
    console.log(res);
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

export default function CourseDetails(props: any) {
  const courseId = props?.params?.courseId;
  // console.log(courseId);
  const { user, setUser } = useAuth();
  
  // const data = await getCourseDetails();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Introduction to Poetry</CardTitle>
          <CardDescription>Course ID: ENG2006</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <div className="mb-4 items-start pb-4 last:mb-0 last:pb-0">
              <div className="my-3">
                <p className="text-sm font-medium leading-none my-3">Time: </p>
                <p className="text-sm text-black">TTh 1:30-3:30pm</p>
              </div>
              <div className="my-3">
                <p className="text-sm font-medium leading-none my-3">
                  Instructor:{" "}
                </p>
                <p className="text-sm text-black">
                  Vladimir Justin (vjustin@aubg.edu)
                </p>
              </div>
              <div className="my-3">
                <p className="text-sm  leading-none my-3">
                  <span className="font-medium">Credits: </span>5
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
                  In this writing intensive seminar, students develop and write
                  a formal proposal for their graduate research project.
                  Additional reading and writing assignments are included to
                  help students better understand the scientific method,
                  consider the creative process and develop personal strategies
                  for writing well. By the end of the semester, students will
                  have a complete/near complete research proposal. Successful
                  examples from past graduate students will be used to help
                  students identify qualities of successful proposals. Each week
                  students explore the content of different sections of the
                  proposal and draft them. Typically, this course is taken in
                  the second year of graduate school and prior to the
                  student&apos;s candidacy exam.
                </p>
              </div>
              <div className="my-3">
                <p className="text-sm font-medium leading-none my-3">
                  Special Note:{" "}
                </p>
                <p className="text-sm text-black">
                  General Education; Pre-requisites: ENG101, Junior Standing;
                  WIC
                </p>
              </div>

              <div className="my-3">
                <p className="text-sm font-medium leading-none my-3">
                  Location:{" "}
                </p>
                <p className="text-sm text-black">MB2</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex space-x-3">
        {user?.role === "student" && (<Button className="px-6 bg-green-700 text-white">Add Course</Button>)}
          {user?.role === "admin" && (
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
                      <Button className="w-full bg-red-600 hover:bg-red-700">
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
