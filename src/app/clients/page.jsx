"use client";

import ClientStatusIcon from "@/components/ClientIcon";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// Modal Component for Adding and Editing Client
const ClientModal = ({
  isOpen,
  onClose,
  onAddClient,
  client,
  onEditClient,
}) => {
  const [clientDetails, setClientDetails] = useState({
    fullName: "",
    email: "",
    phone: "",
    idCard: "",
    passport: "",
    notes: "",
    status: "normal",
    clientBalances: [], // <-- добавили
  });

  useEffect(() => {
    if (client) {
      setClientDetails({
        fullName: client.fullName || "",
        email: client.email || "",
        phone: client.phone ? client.phone.join(", ") : "",
        idCard: client.idCard || "",
        passport: client.passport || "",
        notes: client.notes || "",
        status: client.status || "normal",
        clientBalances: client.clientBalances || [], // <-- заполняем
      });
    }
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClientDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBalanceChange = (index, field, value) => {
    setClientDetails((prev) => {
      const updatedBalances = [...prev.clientBalances];
      updatedBalances[index][field] =
        field === "amount" ? Number(value) : value;
      return { ...prev, clientBalances: updatedBalances };
    });
  };

  const addBalanceRow = () => {
    setClientDetails((prev) => ({
      ...prev,
      clientBalances: [...prev.clientBalances, { currency: "", amount: 0 }],
    }));
  };

  const removeBalanceRow = (index) => {
    setClientDetails((prev) => {
      const updatedBalances = prev.clientBalances.filter((_, i) => i !== index);
      return { ...prev, clientBalances: updatedBalances };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newClientDetails = {
      fullName: clientDetails.fullName,
      email: clientDetails.email,
      phone: clientDetails.phone.split(",").map((p) => p.trim()),
      idCard: clientDetails.idCard,
      passport: clientDetails.passport,
      notes: clientDetails.notes,
      status: clientDetails.status,
      clientBalances: clientDetails.clientBalances, // <-- отправляем на бэк
    };

    try {
      let res;
      if (client) {
        res = await fetch(`/api/clients/${client._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClientDetails),
        });
        if (res.ok) onEditClient(client._id, newClientDetails);
      } else {
        res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newClientDetails),
        });
        if (res.ok) {
          const newClient = await res.json();
          onAddClient(newClient);
        }
      }

      if (res.ok) {
        onClose();
        setClientDetails({
          fullName: "",
          email: "",
          phone: "",
          idCard: "",
          passport: "",
          notes: "",
          status: "normal",
          clientBalances: [],
        });
      }
    } catch (err) {
      alert(err.message);
      console.error("Error saving client", err);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-900 p-6 rounded w-full max-w-sm shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            {client ? "Edit Client" : "Add New Client"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={clientDetails.fullName}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Telegram
              </label>
              <input
                type="text"
                name="email"
                value={clientDetails.email}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Phone(s)
              </label>
              <input
                type="text"
                name="phone"
                value={clientDetails.phone}
                onChange={handleChange}
                placeholder="Comma-separated"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Passport ID
              </label>
              <input
                type="text"
                name="passport"
                value={clientDetails.passport}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                ID Card
              </label>
              <input
                type="text"
                name="idCard"
                value={clientDetails.idCard}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={clientDetails.notes}
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
                value={clientDetails.status}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="vip">VIP</option>
                <option value="normal">Normal</option>
                <option value="bad">Bad</option>
              </select>
            </div>

            {/* === блок Client Balances === */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Client Balances
              </label>
              {clientDetails.clientBalances?.map((bal, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Currency"
                    value={bal.currency}
                    onChange={(e) =>
                      handleBalanceChange(index, "currency", e.target.value)
                    }
                    className="w-1/2 bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={bal.amount}
                    onChange={(e) =>
                      handleBalanceChange(index, "amount", e.target.value)
                    }
                    className="w-1/2 bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeBalanceRow(index)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBalanceRow}
                className="mt-2 px-4 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                + Add Balance
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
                {client ? "Save Changes" : "Add Client"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        setClients(data);
      } catch (err) {
        alert(err.message);
        console.error("Failed to fetch clients", err);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) => {
    const searchLower = search.toLowerCase();
    return (
      client.fullName.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.some((phone) => phone.toLowerCase().includes(searchLower)) ||
      client.idCard.toLowerCase().includes(searchLower) ||
      client.passport.toLowerCase().includes(searchLower) // Added passport to the filter
    );
  });

  const handleAddClient = (newClient) => {
    setClients((prevClients) => [newClient, ...prevClients]);
  };

  const handleEditClient = (id, updatedClientData) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client._id === id ? { ...client, ...updatedClientData } : client
      )
    );
  };

  const handleDeleteClient = async (id) => {
    if (confirm("Are you sure you want to delete this client?")) {
      try {
        const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
        if (res.ok) {
          setClients((prevClients) =>
            prevClients.filter((client) => client._id !== id)
          );
        }
      } catch (err) {
        alert(err.message);
        console.error("Error deleting client", err);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Clients</h1>

      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by any field..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
          className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Add New Client
        </button>
      </div>

      {filteredClients.length === 0 ? (
        <p>No clients found.</p>
      ) : (
        <table className="w-full text-left text-sm bg-gray-900 rounded overflow-hidden">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="p-3">Full Name</th>
              <th className="p-3">Telegram</th>
              <th className="p-3">Phones</th>
              <th className="p-3">Passport</th>
              <th className="p-3">ID Card</th>
              <th className="p-3">Status</th>
              <th className="p-3">Notes</th>
              <th className="p-3">Created At</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client._id} className="hover:bg-gray-800 transition">
                <td className="p-3">
                  <Link
                    href={`/clients/${client._id}`}
                    className="text-indigo-400 hover:underline"
                  >
                    {client.fullName}
                  </Link>
                </td>
                <td className="p-3">{client.email}</td>
                <td className="p-3">{client.phone.join(", ")}</td>
                <td className="p-3">{client.passport}</td>
                <td className="p-3">{client.idCard}</td>
                <td className="p-3 capitalize flex gap-1">
                  {client.status}
                  <ClientStatusIcon status={client.status} />
                </td>
                <td className="p-3 whitespace-pre-wrap">{client.notes}</td>
                <td className="p-3">
                  {new Date(client.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingClient(client);
                      setIsModalOpen(true);
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client._id)}
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

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddClient={handleAddClient}
        onEditClient={handleEditClient}
        client={editingClient}
      />
    </div>
  );
}
