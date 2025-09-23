"use client";

import React, { useEffect, useState } from "react";

// Modal Component for Adding and Editing Investor
const InvestorModal = ({
  isOpen,
  onClose,
  onAddInvestor,
  investor,
  onEditInvestor,
}) => {
  const [investorDetails, setInvestorDetails] = useState({
    name: "",
    info: "",
    status: "active",
    investments: [], // массив вложений
  });

  useEffect(() => {
    if (investor) {
      setInvestorDetails({
        name: investor.name || "",
        info: investor.info || "",
        status: investor.status || "active",
        investments: investor.investments || [],
      });
    }
  }, [investor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvestorDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleInvestmentChange = (index, field, value) => {
    setInvestorDetails((prev) => {
      const updatedInvestments = [...prev.investments];
      updatedInvestments[index][field] =
        field === "amount" || field === "profit" ? Number(value) : value;
      return { ...prev, investments: updatedInvestments };
    });
  };

  const addInvestmentRow = () => {
    setInvestorDetails((prev) => ({
      ...prev,
      investments: [
        ...prev.investments,
        { currency: "", amount: 0, profit: 0, notes: "" },
      ],
    }));
  };

  const removeInvestmentRow = (index) => {
    setInvestorDetails((prev) => {
      const updatedInvestments = prev.investments.filter((_, i) => i !== index);
      return { ...prev, investments: updatedInvestments };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (investor) {
        res = await fetch(`/api/investors/${investor._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(investorDetails),
        });
        if (res.ok) onEditInvestor(investor._id, investorDetails);
      } else {
        res = await fetch("/api/investors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(investorDetails),
        });
        if (res.ok) {
          const newInvestor = await res.json();
          onAddInvestor(newInvestor);
        }
      }

      if (res.ok) {
        onClose();
        setInvestorDetails({
          name: "",
          info: "",
          status: "active",
          investments: [],
        });
      }
    } catch (err) {
      alert(err.message);

      console.error("Error saving investor", err);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-900 p-6 rounded w-full max-w-md shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            {investor ? "Edit Investor" : "Add New Investor"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={investorDetails.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Info
              </label>
              <textarea
                name="info"
                value={investorDetails.info}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Status
              </label>
              <select
                name="status"
                value={investorDetails.status}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* === блок Investments === */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Investments
              </label>
              {investorDetails.investments.map((inv, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Currency"
                    value={inv.currency}
                    onChange={(e) =>
                      handleInvestmentChange(index, "currency", e.target.value)
                    }
                    className="w-1/4 bg-gray-800 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={inv.amount}
                    onChange={(e) =>
                      handleInvestmentChange(index, "amount", e.target.value)
                    }
                    className="w-1/4 bg-gray-800 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    placeholder="Profit"
                    value={inv.profit}
                    onChange={(e) =>
                      handleInvestmentChange(index, "profit", e.target.value)
                    }
                    className="w-1/4 bg-gray-800 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="Notes"
                    value={inv.notes}
                    onChange={(e) =>
                      handleInvestmentChange(index, "notes", e.target.value)
                    }
                    className="w-1/4 bg-gray-800 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeInvestmentRow(index)}
                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addInvestmentRow}
                className="mt-2 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                + Add Investment
              </button>
            </div>

            <div className="flex justify-between mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
              >
                {investor ? "Save Changes" : "Add Investor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default function Investors() {
  const [investors, setInvestors] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvestor, setEditingInvestor] = useState(null);

  useEffect(() => {
    const fetchInvestors = async () => {
      try {
        const res = await fetch("/api/investors");
        const data = await res.json();
        setInvestors(data);
      } catch (err) {
        alert(err.message);

        console.error("Failed to fetch investors", err);
      }
    };
    fetchInvestors();
  }, []);

  const filteredInvestors = investors.filter((inv) => {
    const s = search.toLowerCase();
    return (
      inv.name.toLowerCase().includes(s) || inv.info?.toLowerCase().includes(s)
    );
  });

  const handleAddInvestor = (newInv) =>
    setInvestors((prev) => [newInv, ...prev]);
  const handleEditInvestor = (id, updatedData) =>
    setInvestors((prev) =>
      prev.map((inv) => (inv._id === id ? { ...inv, ...updatedData } : inv))
    );

  const handleDeleteInvestor = async (id) => {
    if (confirm("Are you sure you want to delete this investor?")) {
      try {
        const res = await fetch(`/api/investors/${id}`, { method: "DELETE" });
        if (res.ok)
          setInvestors((prev) => prev.filter((inv) => inv._id !== id));
      } catch (err) {
        alert(err.message);

        console.error("Error deleting investor", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Investors</h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or info..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => {
            setEditingInvestor(null);
            setIsModalOpen(true);
          }}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Add New Investor
        </button>
      </div>

      {filteredInvestors.length === 0 ? (
        <p>No investors found.</p>
      ) : (
        <table className="w-full text-left text-sm bg-gray-900 rounded overflow-hidden">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Info</th>
              <th className="p-3">Status</th>
              <th className="p-3">Investments</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvestors.map((inv) => (
              <tr key={inv._id} className="hover:bg-gray-800 transition">
                <td className="p-3">{inv.name}</td>
                <td className="p-3">{inv.info}</td>
                <td className="p-3 capitalize">{inv.status}</td>
                <td className="p-3">
                  {inv.investments?.map((i, idx) => (
                    <div key={idx}>
                      {i.currency}: {i.amount} (+{i.profit})
                    </div>
                  ))}
                </td>
                <td className="p-3">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingInvestor(inv);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteInvestor(inv._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <InvestorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddInvestor={handleAddInvestor}
        onEditInvestor={handleEditInvestor}
        investor={editingInvestor}
      />
    </div>
  );
}
