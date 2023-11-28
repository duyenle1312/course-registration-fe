import { MainNav } from "@/components/main-nav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <MainNav />
      <div className="flex min-h-screen flex-col items-center justify-center p-5">
        {children}
      </div>
    </section>
  );
}
