"use client";
import React, { useEffect, useMemo, useState } from "react";

export default function SellComponent() {
  const [clientId, setClientId] = useState("");
  const [giveCurrency, setGiveCurrency] = useState("USDT");
  const [giveAmount, setGiveAmount] = useState("");
  const [receiveCurrency, setReceiveCurrency] = useState("USD");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [realGivenAmount, setRealGivenAmount] = useState("");
  const [percent, setPercent] = useState(0.5);
  const [whereAmountGo, setWhereAmountGo] = useState("");
  const [fromWhereLeft, setFromWhereLeft] = useState("");

  const [clients, setClients] = useState([]);
  const [courses, setCourses] = useState([]);
  const [balances, setBalances] = useState([]);
  const [editingField, setEditingField] = useState(null); // "give" | "receive" | null

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, coursesRes, balancesRes] = await Promise.all([
          fetch("/api/clients"),
          fetch("/api/courses"),
          fetch("/api/balances"),
        ]);

        const clientsData = await clientsRes.json();
        const coursesData = await coursesRes.json();
        const balancesData = await balancesRes.json();

        setBalances(balancesData);
        setClients(clientsData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  // Prepare rates lookup (buy/sell prices)
  const RATES = useMemo(() => {
    const rates = {};
    for (const c of courses) {
      rates[c.name] = { buy: c.buy, sell: c.sell };
    }
    // USDT uses USD rates if USD exists
    if (rates["USD"] && !rates["USDT"]) {
      rates["USDT"] = { buy: rates["USD"].buy, sell: rates["USD"].sell };
    }
    return rates;
  }, [courses]);

  // Two-way calculation logic
  useEffect(() => {
    if (
      !giveCurrency ||
      !receiveCurrency ||
      !RATES[giveCurrency] ||
      !RATES[receiveCurrency]
    ) {
      // cannot calculate
      if (editingField === "give") setReceiveAmount("");
      if (editingField === "receive") setGiveAmount("");
      return;
    }

    // Compute rates
    let giveRate = RATES[giveCurrency].buy;
    if (giveCurrency === "USDT") {
      giveRate = RATES["USD"].sell * (1 + percent / 100);
    }

    let receiveRate = RATES[receiveCurrency].sell;
    if (receiveCurrency === "USDT") {
      receiveRate = RATES["USD"].sell * (1 + percent / 100);
    }

    const rate = giveRate / receiveRate;

    if (editingField === "receive") {
      // user edits receiveAmount => calculate giveAmount
      if (!receiveAmount || isNaN(receiveAmount)) {
        setGiveAmount("");
      } else {
        const calculatedGive = parseFloat(receiveAmount) / rate;
        setGiveAmount(
          Number.isFinite(calculatedGive)
            ? calculatedGive.toFixed(6).replace(/\.?0+$/, "")
            : ""
        );
      }
    } else {
      // default or editingField === "give": calculate receiveAmount
      if (!giveAmount || isNaN(giveAmount)) {
        setReceiveAmount("");
      } else {
        const calculatedReceive = parseFloat(giveAmount) * rate;
        setReceiveAmount(
          Number.isFinite(calculatedReceive) ? calculatedReceive.toFixed(2) : ""
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    giveAmount,
    receiveAmount,
    giveCurrency,
    receiveCurrency,
    RATES,
    percent,
    editingField,
  ]);

  // Donation (can be negative)
  const donation = useMemo(() => {
    if (receiveAmount === "" || realGivenAmount === "") return "";
    const diff = parseFloat(realGivenAmount) - parseFloat(receiveAmount);
    if (!Number.isFinite(diff)) return "";
    return diff.toFixed(2);
  }, [receiveAmount, realGivenAmount]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!giveAmount || isNaN(giveAmount) || parseFloat(giveAmount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    if (
      !realGivenAmount ||
      isNaN(realGivenAmount) ||
      parseFloat(realGivenAmount) < 0
    ) {
      alert("Please enter the actual given amount.");
      return;
    }

    const newTransaction = {
      clientId,
      type: "sell",
      givenCurrency: receiveCurrency,
      givenAmount: parseFloat(receiveAmount),
      receivedCurrency: giveCurrency,
      receivedAmount: parseFloat(giveAmount),
      exchangeRate:
        parseFloat(receiveAmount) && parseFloat(giveAmount)
          ? parseFloat(receiveAmount) / parseFloat(giveAmount)
          : 0,
      method: "cash",
      percent: giveCurrency === "USDT" ? percent : 0,
      note: donation !== "0.00" ? "donation" : "",
      donation: parseFloat(donation) || 0,
      whereAmountGo: receiveCurrency === "USDT" ? whereAmountGo : "",
      fromWhereLeft: giveCurrency === "USDT" ? fromWhereLeft : "",
    };

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTransaction),
      });

      if (!res.ok) throw new Error("Failed to submit transaction");

      // trigger balances refetch elsewhere in app
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("balances:refetch"));
      }

      const saved = await res.json();

      // Reset form
      setGiveAmount("");
      setReceiveAmount("");
      setRealGivenAmount("");
      setPercent(0.5);
      setClientId("");
      setEditingField(null);
      setWhereAmountGo("");
      setFromWhereLeft("");
    } catch (error) {
      alert(error.message);
    }
  };

  // Utilities for selects
  const uniqueCurrencies = useMemo(() => {
    const all = [...courses.map((c) => c.name), "USDT", "AMD"];
    return all.filter((v, i, a) => a.indexOf(v) === i);
  }, [courses]);

  const balancesValues = balances
    .map((balance) => balance.name)
    .filter((name) => !["Casa", "Safe"].includes(name));

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount and currency to give */}
        <div className="space-y-4 border border-gray-700 p-4 rounded">
          <div>
            <label className="block mb-1">Amount</label>
            <div className="flex gap-2">
              <select
                value={giveCurrency}
                onChange={(e) => setGiveCurrency(e.target.value)}
                className="rounded bg-gray-700 p-2"
                required
              >
                {uniqueCurrencies.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={giveAmount}
                onChange={(e) => {
                  setGiveAmount(e.target.value);
                  setEditingField("give");
                }}
                className="rounded bg-gray-700 p-2 flex-1"
                placeholder="Amount"
                min="0"
                step="any"
                required
              />

              {giveCurrency === "USDT" && (
                <select
                  value={fromWhereLeft}
                  onChange={(e) => setFromWhereLeft(e.target.value)}
                  className="rounded bg-gray-700 p-2"
                >
                  <option value="">Select wallet</option>
                  {balancesValues.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Receive currency */}
          <label className="block mb-1">To Give Currency</label>
          <div className="flex gap-2">
            <select
              value={receiveCurrency}
              onChange={(e) => setReceiveCurrency(e.target.value)}
              className="w-full rounded bg-gray-700 p-2"
              required
            >
              {uniqueCurrencies.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>

            {receiveCurrency === "USDT" && (
              <select
                value={whereAmountGo}
                onChange={(e) => setWhereAmountGo(e.target.value)}
                className="rounded bg-gray-700 p-2"
              >
                <option value="">Select wallet</option>
                {balancesValues.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Custom percent input for USDT */}
          {(giveCurrency === "USDT" || receiveCurrency === "USDT") && (
            <div>
              <label className="block mb-1">Custom Percentage (%)</label>
              <input
                type="number"
                step="0.01"
                value={percent}
                onChange={(e) => setPercent(parseFloat(e.target.value) || 0)}
                className="w-full rounded bg-gray-700 p-2"
              />
            </div>
          )}

          {/* Calculated/Editable receive amount */}
          <div>
            <label className="block mb-1">To Give Amount</label>
            <input
              type="number"
              value={receiveAmount}
              onChange={(e) => {
                setReceiveAmount(e.target.value);
                setEditingField("receive");
              }}
              className="w-full rounded bg-gray-700 p-2"
              placeholder="To Give Amount"
            />
          </div>
        </div>

        {/* Client */}
        <div>
          <label className="block mb-1">Client</label>
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded bg-gray-700 p-2"
          >
            <option value="">Select client</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>
                {client.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* Actual given amount */}
        <div>
          <label className="block mb-1">Actual Given Amount</label>
          <input
            type="number"
            value={realGivenAmount}
            onChange={(e) => setRealGivenAmount(e.target.value)}
            className="w-full rounded bg-gray-700 p-2"
            placeholder="Amount"
            min="0"
            step="any"
            required
          />
        </div>

        {/* Donation */}
        <div>
          <label className="block mb-1">Donation</label>
          <input
            type="text"
            value={donation}
            readOnly
            className="w-full rounded bg-gray-700 p-2 text-gray-400"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="bg-indigo-600 px-6 py-2 rounded hover:bg-indigo-700 transition font-semibold w-full"
        >
          Submit Transaction
        </button>
      </form>
    </div>
  );
}
