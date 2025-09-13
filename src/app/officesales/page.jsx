"use client";

import React, { useEffect, useState } from "react";

const OfficeSaleModal = ({ isOpen, onClose, onAddSale, sale, onEditSale }) => {
  const [saleDetails, setSaleDetails] = useState({
    title: "",
    amount: 0,
    currency: "AMD",
    method: "",
    note: "",
    date: new Date(),
  });

  // список готовых методов (можешь дополнять)
  const methodOptions = [
    "Ashxatavardz",
    "Komunal",
    "Taracqi vchar",
    "Hyurasirutyun",
    "Atkat",
  ];

  useEffect(() => {
    if (sale) {
      setSaleDetails({
        title: sale.title || "",
        amount: sale.amount || 0,
        currency: sale.currency || "AMD",
        method: sale.method || "",
        note: sale.note || "",
        date: sale.date ? new Date(sale.date).toISOString().slice(0, 10) : "",
      });
    }
  }, [sale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSaleDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newSaleDetails = {
      ...saleDetails,
      amount: Number(saleDetails.amount),
      date: saleDetails.date ? new Date(saleDetails.date) : new Date(),
    };

    try {
      let res;
      if (sale) {
        res = await fetch(`/api/officesales/${sale._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSaleDetails),
        });
        if (res.ok) onEditSale(sale._id, newSaleDetails);
      } else {
        res = await fetch("/api/officesales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newSaleDetails),
        });
        if (res.ok) {
          const newSale = await res.json();
          onAddSale(newSale);
        }
      }

      if (res.ok) {
        onClose();
        setSaleDetails({
          title: "",
          amount: 0,
          currency: "AMD",
          method: "",
          note: "",
          date: "",
        });
      }
    } catch (err) {
      console.error("Error saving office sale", err);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-900 p-6 rounded w-full max-w-sm shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            {sale ? "Edit Office Sale" : "Add New Office Sale"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={saleDetails.title}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Amount (AMD)
              </label>
              <input
                type="number"
                name="amount"
                value={saleDetails.amount}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={saleDetails.date}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Method */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Method
              </label>
              <select
                name="method"
                value={saleDetails.method}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
              >
                {methodOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Note
              </label>
              <textarea
                name="note"
                value={saleDetails.note}
                onChange={handleChange}
                rows={3}
                className="w-full bg-gray-800 text-white px-4 py-2 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Buttons */}
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
                {sale ? "Save Changes" : "Add Sale"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

// export default function OfficeSales() {
//   useAdminAuth();

//   const [sales, setSales] = useState([]);
//   const [search, setSearch] = useState("");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingSale, setEditingSale] = useState(null);

//   useEffect(() => {
//     const fetchSales = async () => {
//       try {
//         const res = await fetch("/api/officesales");
//         const data = await res.json();
//         setSales(data);
//       } catch (err) {
//         console.error("Failed to fetch office sales", err);
//       }
//     };
//     fetchSales();
//   }, []);

//   const filteredSales = sales.filter((sale) => {
//     const searchLower = search.toLowerCase();
//     return (
//       sale.title.toLowerCase().includes(searchLower) ||
//       sale.currency.toLowerCase().includes(searchLower) ||
//       (sale.note && sale.note.toLowerCase().includes(searchLower))
//     );
//   });

//   const handleAddSale = (newSale) => {
//     setSales((prevSales) => [newSale, ...prevSales]);
//   };

//   const handleEditSale = (id, updatedSaleData) => {
//     setSales((prevSales) =>
//       prevSales.map((sale) =>
//         sale._id === id ? { ...sale, ...updatedSaleData } : sale
//       )
//     );
//   };

//   const handleDeleteSale = async (id) => {
//     if (confirm("Are you sure you want to delete this sale?")) {
//       try {
//         const res = await fetch(`/api/officesales/${id}`, { method: "DELETE" });
//         if (res.ok) {
//           setSales((prevSales) => prevSales.filter((sale) => sale._id !== id));
//         }
//       } catch (err) {
//         console.error("Error deleting office sale", err);
//       }
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-semibold mb-4">Office Sales</h1>

//       <div className="mb-6 flex justify-between items-center">
//         <input
//           type="text"
//           placeholder="Search by title, currency, note..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full max-w-md px-4 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
//         />
//         <button
//           onClick={() => {
//             setEditingSale(null);
//             setIsModalOpen(true);
//           }}
//           className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded"
//         >
//           Add New Sale
//         </button>
//       </div>

//       {filteredSales.length === 0 ? (
//         <p>No office sales found.</p>
//       ) : (
//         <table className="w-full text-left text-sm bg-gray-900 rounded overflow-hidden">
//           <thead className="bg-gray-700 text-gray-200">
//             <tr>
//               <th className="p-3">Title</th>
//               <th className="p-3">Amount</th>
//               <th className="p-3">Currency</th>
//               <th className="p-3">Date</th>
//               <th className="p-3">Note</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSales.map((sale) => (
//               <tr key={sale._id} className="hover:bg-gray-800 transition">
//                 <td className="p-3">{sale.title}</td>
//                 <td className="p-3">{sale.amount}</td>
//                 <td className="p-3">{sale.currency}</td>
//                 <td className="p-3">
//                   {sale.date ? new Date(sale.date).toLocaleDateString() : "—"}
//                 </td>
//                 <td className="p-3 whitespace-pre-wrap">{sale.note}</td>
//                 <td className="p-3 flex items-center space-x-2">
//                   <button
//                     onClick={() => {
//                       setEditingSale(sale);
//                       setIsModalOpen(true);
//                     }}
//                     className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteSale(sale._id)}
//                     className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <OfficeSaleModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onAddSale={handleAddSale}
//         onEditSale={handleEditSale}
//         sale={editingSale}
//       />
//     </div>
//   );
// }

export default function OfficeSales() {
  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState(null);

  // ===== новые состояния для фильтра =====
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [methodFilter, setMethodFilter] = useState(""); // <--- метод

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await fetch("/api/officesales");
        const data = await res.json();
        setSales(data);
      } catch (err) {
        console.error("Failed to fetch office sales", err);
      }
    };
    fetchSales();
  }, []);

  const handleAddSale = (newSale) => {
    setSales((prevSales) => [newSale, ...prevSales]);
  };

  const handleEditSale = (id, updatedSaleData) => {
    setSales((prevSales) =>
      prevSales.map((sale) =>
        sale._id === id ? { ...sale, ...updatedSaleData } : sale
      )
    );
  };

  const handleDeleteSale = async (id) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      try {
        const res = await fetch(`/api/officesales/${id}`, { method: "DELETE" });
        if (res.ok) {
          setSales((prevSales) => prevSales.filter((sale) => sale._id !== id));
        }
      } catch (err) {
        console.error("Error deleting office sale", err);
      }
    }
  };

  // ===== фильтрация =====
  const filteredSales = sales.filter((sale) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      sale.title.toLowerCase().includes(searchLower) ||
      sale.currency.toLowerCase().includes(searchLower) ||
      (sale.note && sale.note.toLowerCase().includes(searchLower));

    const saleDate = sale.date ? new Date(sale.date) : null;
    const afterStart = startDate
      ? saleDate && saleDate >= new Date(startDate)
      : true;
    const beforeEnd = endDate
      ? saleDate && saleDate <= new Date(endDate + "T23:59:59")
      : true;

    const matchesMethod = methodFilter
      ? sale.method && sale.method.toLowerCase() === methodFilter.toLowerCase()
      : true;

    return matchesSearch && afterStart && beforeEnd && matchesMethod;
  });

  const totalAmount = filteredSales.reduce(
    (sum, sale) => sum + (Number(sale.amount) || 0),
    0
  );

  // получаем список всех уникальных методов для селекта
  const uniqueMethods = Array.from(
    new Set(sales.map((s) => s.method).filter(Boolean))
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Office Sales</h1>

      {/* Верхняя панель фильтров */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="Search by title, currency, note..."
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

        {/* фильтр по методу */}
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-3 py-2 rounded bg-gray-800 text-white"
        >
          <option value="">All methods</option>
          {uniqueMethods.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setEditingSale(null);
            setIsModalOpen(true);
          }}
          className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Add New Sale
        </button>
      </div>

      {filteredSales.length === 0 ? (
        <p>No office sales found.</p>
      ) : (
        <>
          <table className="w-full text-left text-sm bg-gray-900 rounded overflow-hidden">
            <thead className="bg-gray-700 text-gray-200">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Currency</th>
                <th className="p-3">Method</th>
                <th className="p-3">Date</th>
                <th className="p-3">Note</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale._id} className="hover:bg-gray-800 transition">
                  <td className="p-3">{sale.title}</td>
                  <td className="p-3">{sale.amount}</td>
                  <td className="p-3">{sale.currency}</td>
                  <td className="p-3">{sale.method}</td>
                  <td className="p-3">
                    {sale.date ? new Date(sale.date).toLocaleDateString() : "—"}
                  </td>
                  <td className="p-3 whitespace-pre-wrap">{sale.note}</td>
                  <td className="p-3 flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingSale(sale);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSale(sale._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 text-right text-lg font-semibold text-white">
            Total: {totalAmount.toLocaleString()} AMD
          </div>
        </>
      )}

      <OfficeSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSale={handleAddSale}
        onEditSale={handleEditSale}
        sale={editingSale}
      />
    </div>
  );
}
