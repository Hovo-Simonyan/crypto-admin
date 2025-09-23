"use client";
import React, { useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  useAdminAuth();

  useEffect(() => {
    const handleError = (event) => {
      console.error("Uncaught Error:", event.error);
      alert("Unexpected error: " + event.error?.message);
    };

    const handleRejection = (event) => {
      console.error("Unhandled Promise:", event.reason);
      alert("Unhandled Promise: " + event.reason?.message);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  if (pathname === "/login") {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
          <Header />
          <div className="flex flex-grow overflow-hidden">
            <Sidebar />
            <main className="flex-grow p-8 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
