import { CourseList } from "@/components/course-list";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
async function getRegisteredCourses() {
  const API_url = process.env.NEXT_PUBLIC_BACKEND_URL;
  console.log(API_url);
  try {
    const res = await fetch(`${API_url}/api/health_checker`);
    console.log(res)
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
}

export default async function RegisteredCourses() {
  // If admin
  // const data = await getRegisteredCourses();
  return (
    <>
      <div className="flex p-5 w-full fixed bg-white bg-opacity-30 backdrop-blur-lg rounded drop-shadow-md">
        <MainNav className="" />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center lg:p-32 md:p-20 p-5">
      <CourseList 
        role="student"
        functionality="Drop Course"/>
      </div>
    </>
  );
}
