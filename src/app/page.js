"use client";
import BuyComponent from "@/components/BuyComponent";
import SellComponent from "@/components/SellComponent";
import TransactionsList from "@/components/TransactionsList";
import React, { useState } from "react";

export default function Main() {
  const [activeTab, setActiveTab] = useState("sell");

  return (
    <>
      <div className="max-w-lg mx-auto mt-6 flex gap-4">
        <button
          onClick={() => setActiveTab("buy")}
          className={`flex-1 px-4 py-2 rounded font-semibold transition ${
            activeTab === "buy"
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setActiveTab("sell")}
          className={`flex-1 px-4 py-2 rounded font-semibold transition ${
            activeTab === "sell"
              ? "bg-indigo-600 hover:bg-indigo-700"
              : "bg-gray-700 hover:bg-gray-600"
          }`}
        >
          Sell
        </button>
      </div>

      <div className="mt-6">
        {activeTab === "buy" ? <BuyComponent /> : <SellComponent />}
      </div>

      <TransactionsList />
    </>
  );
}
