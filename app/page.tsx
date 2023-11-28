import { CourseList } from "@/components/course-list";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";

export default async function Home() {
  return (
    <>
      <MainNav />
      <div className="flex min-h-screen flex-col items-center justify-center lg:p-32 md:p-20 p-5">
        <CourseList functionality="Add Course" />
      </div>
    </>
  );
}
