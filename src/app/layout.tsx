import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "kotelnya",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased hide-scrollbar`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <div className="fixed w-full border-b top-[64px]" /> */}
          <SidebarProvider>
            <AppSidebar />
            {children}
            <ThemeToggle />
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
