import { useState } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bg-[#1B1D20] py-24">{children}</div>;
}
