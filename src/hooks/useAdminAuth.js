"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useAdminAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (pathname === "/login") {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      const res = await fetch("/api/me", { method: "GET" });

      if (!res.ok) {
        router.push("/login");
      }

      setLoading(false);
    }

    checkAuth();
  }, []);

  return { loading };
}
