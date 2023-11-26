import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
      <section>
        <div className="flex p-5 w-full fixed bg-white bg-opacity-30 backdrop-blur-lg rounded drop-shadow-md">
          <MainNav className="" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
        <div className="flex min-h-screen flex-col items-center justify-center pt-24 lg:p-32 md:p-20 p-5">
          {children}
        </div>
      </section>
 
  );
}
