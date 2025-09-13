"use client";

import React, { useEffect, useState } from "react";

export default function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then(setTransactions)
      .catch(console.error);
  };

  useEffect(() => {
    if (!selectedTx) {
      setSelectedClient(null);
      return;
    }
    fetch(`/api/clients/${selectedTx.clientId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Client not found");
        return res.json();
      })
      .then(setSelectedClient)
      .catch(() => setSelectedClient(null));
  }, [selectedTx]);

  const handleOpen = (tx) => {
    setSelectedTx(tx);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTx(null);
    setSelectedClient(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const res = await fetch(`/api/transactions/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      // Refresh transactions list and close dialog if open transaction deleted
      fetchTransactions();

      if (selectedTx && selectedTx._id === id) {
        handleClose();
      }
    } catch (err) {
      alert("Error deleting transaction");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions found.</p>
      ) : (
        <ul className="divide-y divide-gray-700">
          {transactions.map((tx) => (
            <li key={tx._id} className="flex justify-between items-center">
              <button
                onClick={() => handleOpen(tx)}
                className="flex-grow text-left px-4 py-3 hover:bg-gray-800 rounded"
              >
                <div className="flex justify-between">
                  <span className="font-medium">
                    {tx.type.toUpperCase()} - {tx.givenAmount}{" "}
                    {tx.givenCurrency} → {tx.receivedAmount}{" "}
                    {tx.receivedCurrency}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Rate: {tx.exchangeRate.toFixed(4)}
                  </span>
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Client ID: {tx.clientId}
                </div>
              </button>
              <button
                onClick={() => handleDelete(tx._id)}
                className="ml-3 bg-red-600 hover:bg-red-700 transition px-3 py-1 rounded text-white text-sm"
                title="Delete transaction"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Modal */}
      {open && selectedTx && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-lg relative">
            <h3 className="text-xl font-semibold mb-4">Transaction Details</h3>

            <div className="space-y-2 text-white text-sm">
              <div>
                <span className="font-semibold">ID:</span> {selectedTx._id}
              </div>
              <div>
                <span className="font-semibold">Client:</span>{" "}
                {selectedClient ? selectedClient.fullName : "Loading..."}
              </div>
              <div>
                <span className="font-semibold">Type:</span> {selectedTx.type}
              </div>
              <div>
                <span className="font-semibold">Given Currency:</span>{" "}
                {selectedTx.givenCurrency}
              </div>
              <div>
                <span className="font-semibold">Given Amount:</span>{" "}
                {selectedTx.givenAmount}
              </div>
              <div>
                <span className="font-semibold">Received Currency:</span>{" "}
                {selectedTx.receivedCurrency}
              </div>
              <div>
                <span className="font-semibold">Received Amount:</span>{" "}
                {selectedTx.receivedAmount}
              </div>
              <div>
                <span className="font-semibold">Exchange Rate:</span>{" "}
                {selectedTx.exchangeRate}
              </div>
              <div>
                <span className="font-semibold">Method:</span>{" "}
                {selectedTx.method}
              </div>
              <div>
                <span className="font-semibold">Percent:</span>{" "}
                {selectedTx.percent}%
              </div>
              <div>
                <span className="font-semibold">Donation:</span>{" "}
                {selectedTx.donation}
              </div>
              <div>
                <span className="font-semibold">Note:</span>{" "}
                {selectedTx.note || "—"}
              </div>
              <div>
                <span className="font-semibold">Created At:</span>{" "}
                {new Date(selectedTx.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Updated At:</span>{" "}
                {new Date(selectedTx.updatedAt).toLocaleString()}
              </div>
            </div>

            <button
              onClick={handleClose}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 transition px-6 py-2 rounded font-semibold text-white block mx-auto"
            >
              Close
            </button>

            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
