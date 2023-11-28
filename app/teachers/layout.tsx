import { MainNav } from "@/components/main-nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <MainNav />
      <div className="flex min-h-screen flex-col items-center justify-center pt-24 lg:p-32 md:p-20 p-5">
        {children}
      </div>
    </section>
  );
}
