"use client";

import React, { useEffect, useState } from "react";

export default function BalancePage() {
  const [balances, setBalances] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    image: "",
    balances: [], // теперь массив валют
  });

  // ===== Fetch balances =====
  useEffect(() => {
    const fetchBalances = async () => {
      try {
        const res = await fetch("/api/balances");
        const data = await res.json();
        setBalances(data);
      } catch (error) {
        console.error("Failed to fetch balances:", error);
      }
    };
    fetchBalances();
  }, []);

  // ===== Dialog controls =====
  const openAddDialog = () => {
    setIsEditing(false);
    setFormData({ id: "", name: "", image: "", balances: [] });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item) => {
    setIsEditing(true);
    setFormData({
      id: item._id,
      name: item.name,
      image: item.image,
      balances: item.balances || [],
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setFormData({ id: "", name: "", image: "", balances: [] });
  };

  // ===== Handle form actions =====
  const handleBalanceChange = (index, field, value) => {
    const updatedBalances = [...formData.balances];
    updatedBalances[index][field] = value;
    setFormData({ ...formData, balances: updatedBalances });
  };

  const addCurrencyField = () => {
    setFormData({
      ...formData,
      balances: [...formData.balances, { currency: "", amount: 0 }],
    });
  };

  const removeCurrencyField = (index) => {
    setFormData({
      ...formData,
      balances: formData.balances.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    try {
      const response = isEditing
        ? await fetch(`/api/balances/${formData.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          })
        : await fetch("/api/balances", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          });

      if (response.ok) {
        const newBalance = await response.json();
        if (isEditing) {
          setBalances((prev) =>
            prev.map((b) => (b._id === newBalance._id ? newBalance : b))
          );
        } else {
          setBalances((prev) => [...prev, newBalance]);
        }
        closeDialog();
      } else {
        alert("Error while saving balance.");
      }
    } catch (error) {
      console.error("Failed to submit balance:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      try {
        const res = await fetch(`/api/balances/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setBalances((prev) => prev.filter((b) => b._id !== id));
        } else {
          alert("Error deleting balance.");
        }
      } catch (error) {
        console.error("Failed to delete balance:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Balance</h1>

      <button
        onClick={openAddDialog}
        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
      >
        + Add Storage
      </button>

      {/* List of balances */}
      <div className="space-y-4">
        {balances.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-gray-800 rounded p-4 shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image || "https://via.placeholder.com/40?text=💰"}
                alt={item.name}
                className="w-10 h-10 rounded object-cover bg-gray-700"
              />
              <div>
                <p className="text-lg font-medium">{item.name}</p>
                <ul className="text-sm text-gray-400">
                  {item.balances?.map((b, idx) => (
                    <li key={idx}>
                      {b.amount?.toLocaleString()} {b.currency.toUpperCase()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => openEditDialog(item)}
                className="px-3 py-1 text-sm bg-yellow-500 text-black rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded w-full max-w-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Storage" : "Add Storage"}
            </h2>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block mb-1 text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Image URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                />
              </div>

              {/* Balances */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Balances
                </label>
                {formData.balances.map((b, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Currency (e.g. usd)"
                      value={b.currency}
                      onChange={(e) =>
                        handleBalanceChange(index, "currency", e.target.value)
                      }
                      className="w-1/3 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Amount"
                      value={b.amount}
                      onChange={(e) =>
                        handleBalanceChange(index, "amount", e.target.value)
                      }
                      className="w-2/3 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                    />
                    <button
                      onClick={() => removeCurrencyField(index)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCurrencyField}
                  className="mt-2 px-3 py-1 bg-green-600 text-white rounded"
                >
                  + Add Currency
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
              >
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
