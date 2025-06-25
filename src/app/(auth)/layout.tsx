import { ClearLocalStorage } from "@/components/auth/clear-local-storage";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <ClearLocalStorage />
    </>
  );
}
