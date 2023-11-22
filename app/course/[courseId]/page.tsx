import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CardProps = React.ComponentProps<typeof Card>;

export default function CourseDetails(props: any) {
  const courseId = props?.params?.courseId;
  console.log(courseId);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>Introduction to Poetry</CardTitle>
          <CardDescription>ID: ENG2006</CardDescription>
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
                  Description
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
          <Button className="px-6 bg-blue-800 text-white">Add Course</Button>
          {/* <Button className="px-6">Back to All Courses</Button> */}
        </CardFooter>
      </Card>
    </div>
  );
}
