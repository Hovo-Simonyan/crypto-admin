"use client";

import ClientStatusIcon from "@/components/ClientIcon";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ClientDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [client, setClient] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        // Fetch client details
        const clientRes = await fetch(`/api/clients/${id}`);
        if (!clientRes.ok) {
          throw new Error("Failed to fetch client details");
        }
        const clientData = await clientRes.json();
        setClient(clientData);

        // Fetch transactions
        const transactionsRes = await fetch(`/api/transactions/client/${id}`);
        if (!transactionsRes.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const transactionsData = await transactionsRes.json();
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message); // Set the error state
      } finally {
        setLoading(false);
      }
    };

    fetchClientDetails();
  }, [id, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!client) {
    return <p>Client not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button
        onClick={() => router.push("/clients")}
        className="mb-4 text-indigo-400 hover:underline"
      >
        ← Back to client list
      </button>

      <h1 className="text-2xl font-semibold mb-4">{client.fullName}</h1>

      <div className="space-y-2 mb-6 bg-gray-800 p-4 rounded shadow text-white">
        <p>
          <strong>Email:</strong> {client.email}
        </p>
        <p>
          <strong>Phones:</strong> {client.phone.join(", ")}
        </p>
        <p>
          <strong>Passport:</strong> {client.passport}
        </p>
        <p>
          <strong>ID Card:</strong> {client.idCard}
        </p>
        <p className="flex gap-2">
          <strong>Status:</strong>{" "}
          <span className="capitalize flex gap-1">
            {client.status || "normal"}{" "}
            <ClientStatusIcon status={client.status} />
          </span>
        </p>
        <p className="flex gap-2">
          <strong>Notes:</strong>
          <br />
          <span className="whitespace-pre-wrap">{client.notes || "-"}</span>
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(client.createdAt).toLocaleDateString()}
        </p>

        {client.clientBalances?.length > 0 && (
          <div className="mt-4">
            <strong>Balances:</strong>
            <ul className="mt-2 space-y-1">
              {client.clientBalances.map((bal, idx) => (
                <li key={idx} className="text-sm text-gray-300">
                  {bal.currency}: {bal.amount.toLocaleString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-white">Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-sm text-gray-400">No transactions found.</p>
        ) : (
          <ul className="space-y-4 text-white">
            {transactions.map((tx) => (
              <li
                key={tx._id}
                className="border border-gray-700 rounded p-4 text-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold uppercase">
                    {tx.type} {/* buy or sell */}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mb-1">
                  <strong>Given:</strong> {tx.givenAmount.toLocaleString()}{" "}
                  {tx.givenCurrency}
                </div>
                <div className="mb-1">
                  <strong>Received:</strong>{" "}
                  {tx.receivedAmount.toLocaleString()} {tx.receivedCurrency}
                </div>

                <div className="mb-1 text-gray-400 text-xs">
                  Rate: {tx.exchangeRate} | Commission: {tx.percent}%
                </div>

                {tx.donation > 0 && (
                  <div className="mb-1 text-green-400 text-xs">
                    Donation: {tx.donation.toLocaleString()}{" "}
                    {tx.receivedCurrency}
                  </div>
                )}

                {tx.method && (
                  <div className="mb-1 text-gray-300 text-xs">
                    Method: {tx.method}
                  </div>
                )}

                {tx.note && (
                  <div className="mb-1 text-gray-400 italic text-xs">
                    Note: {tx.note}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
