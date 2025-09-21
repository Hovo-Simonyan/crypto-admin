"use client";
import { useEffect, useState } from "react";
import { formatNumber } from "./../../utils/common";

export default function TransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  console.log(transactions);
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      (tx.note && tx.note.toLowerCase().includes(searchLower)) ||
      (tx.givenCurrency &&
        tx.givenCurrency.toLowerCase().includes(searchLower)) ||
      (tx.receivedCurrency &&
        tx.receivedCurrency.toLowerCase().includes(searchLower));

    const txDate = tx.createdAt ? new Date(tx.createdAt) : null;
    const afterStart = startDate
      ? txDate && txDate >= new Date(startDate)
      : true;
    const beforeEnd = endDate
      ? txDate && txDate <= new Date(endDate + "T23:59:59")
      : true;

    const matchesType = typeFilter ? tx.type === typeFilter : true;

    return matchesSearch && afterStart && beforeEnd && matchesType;
  });

  // ===== доход текущего месяца по валютам =====
  const now = new Date();

  const monthlyIncomeByCurrency = {};

  filteredTransactions.forEach((tx) => {
    const currency = tx.receivedCurrency || "UNKNOWN";
    const value = tx.receivedAmount || 0;

    if (!monthlyIncomeByCurrency[currency]) {
      monthlyIncomeByCurrency[currency] = 0;
    }
    monthlyIncomeByCurrency[currency] += value;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Transactions</h1>

      {/* Панель фильтров */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by note, currency..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white"
        >
          <option value="">All types</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <>
          <table className="w-full text-left text-sm bg-gray-900 rounded overflow-hidden">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Given</th>
                <th className="p-3">Received</th>
                <th className="p-3">Rate</th>
                <th className="p-3">Percent</th>
                <th className="p-3">Donation</th>
                <th className="p-3">Client</th>
                <th className="p-3">Note</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-gray-800 transition">
                  <td className="p-3">{tx.type}</td>
                  <td className="p-3">
                    {tx.givenAmount} {tx.givenCurrency}
                  </td>
                  <td className="p-3">
                    {tx.receivedAmount} {tx.receivedCurrency}
                  </td>
                  <td className="p-3">{tx.exchangeRate || "—"}</td>
                  <td className="p-3">{tx.percent}</td>
                  <td className="p-3">{tx.donation}</td>
                  <td className="p-3">{tx.clientId?.fullName}</td>
                  <td className="p-3 whitespace-pre-wrap">{tx.note}</td>
                  <td className="p-3">
                    {tx.createdAt
                      ? new Date(tx.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-right text-lg font-semibold text-white">
            <p className="mb-2">Monthly Income:</p>
            {Object.entries(monthlyIncomeByCurrency).map(
              ([currency, amount]) => (
                <div key={currency}>
                  {currency}: {formatNumber(amount)}
                </div>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
