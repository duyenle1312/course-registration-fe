"use client";
import { CourseInfo } from "@/components/course-info";


export default function CreateACourse(props: any) {
  const courseId = props?.params?.courseId;
  
  return <CourseInfo title="Edit Course Information" courseId={courseId} functionality="edit" />;
}
