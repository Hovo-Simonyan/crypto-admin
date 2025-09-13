"use client";

import React, { useState, useEffect } from "react";

export default function Sidebar() {
  const [balances, setBalances] = useState([]);

  // Загрузка балансов и курсов из API
  useEffect(() => {
    async function fetchBalances() {
      try {
        const res = await fetch("/api/balances");
        const data = await res.json();
        setBalances(data);
      } catch (err) {
        console.error("Failed to fetch balances:", err);
      }
    }

    fetchBalances();

    // Listen for "balances:refetch" event and refetch balances
    if (typeof window !== "undefined") {
      const handleRefetch = () => {
        fetchBalances();
      };

      window.addEventListener("balances:refetch", handleRefetch);
      return () => {
        window.removeEventListener("balances:refetch", handleRefetch);
      };
    }
  }, []);

  return (
    <aside className="w-96 bg-gray-800 p-8 flex flex-col space-y-10 text-white">
      <ul className="space-y-6 text-lg font-mono">
        {balances.length > 0 ? (
          balances.map((wallet) => (
            <li key={wallet._id} className="flex flex-col gap-2">
              {/* Первая строка: название кошелька с иконкой */}
              <div className="flex items-center gap-2 font-semibold">
                {wallet.image && (
                  <img
                    src={wallet.image}
                    width={20}
                    height={20}
                    alt={wallet.name}
                  />
                )}
                {wallet.name}
              </div>

              {/* Вторая строка: список валют */}
              <ul className="ml-6 space-y-1 text-sm text-gray">
                {wallet.balances?.map((bal, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    {/* Можно добавить иконку валюты, если есть */}
                    <span>
                      {bal.currency.toUpperCase()}:{" "}
                      {typeof bal.amount === "number"
                        ? bal.amount.toLocaleString()
                        : "0"}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <li>Loading...</li>
        )}
      </ul>
    </aside>
  );
}
