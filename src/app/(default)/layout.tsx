import { AppSidebar } from "@/components/sidebar/app-sidebar";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppSidebar />
      {children}
    </>
  );
}
