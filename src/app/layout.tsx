import { useState } from "react";
import NavBar from "./NavBar";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Marking App",
  description: "App for marking, designed for the UNSW COMP6080 course",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="min-h-screen flex flex-col bg-[#1B1D20]">
      <body
        suppressHydrationWarning={true}
        className={inter.className + " flex-1 flex flex-col "}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
