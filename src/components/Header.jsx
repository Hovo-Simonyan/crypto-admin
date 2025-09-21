"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    // Попробуем получить имя админа из localStorage
    // (лучше, конечно, брать из контекста или API)
    const name = localStorage.getItem("adminName");
    if (name) setAdminName(name);
  }, []);

  const linkClass = (path) =>
    `px-3 py-2 rounded ${
      pathname === path
        ? "bg-indigo-700 text-white"
        : "text-gray-300 hover:bg-indigo-600 hover:text-white"
    } transition`;

  // Функция logout
  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("adminName");
    router.push("/login");
  };

  return (
    <header className="bg-gray-800 px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-semibold text-white">
        Crypto Admin Dashboard
      </h1>

      <nav className="space-x-2 flex items-center">
        <Link href="/" className={linkClass("/")}>
          Main
        </Link>
        <Link href="/transactions" className={linkClass("/transactions")}>
          Transactions
        </Link>
        <Link href="/balance" className={linkClass("/balance")}>
          Balance
        </Link>
        <Link href="/clients" className={linkClass("/clients")}>
          Clients
        </Link>
        <Link href="/courses" className={linkClass("/courses")}>
          Courses
        </Link>
        <Link href="/officesales" className={linkClass("/officesales")}>
          Office Sales
        </Link>
        <Link href="/investors" className={linkClass("/investors")}>
          Investors
        </Link>

        {adminName && (
          <>
            <span
              className="text-gray-300 ml-4 mr-2"
              style={{ marginLeft: 100 }}
            >
              Hi, {adminName}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
              type="button"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
