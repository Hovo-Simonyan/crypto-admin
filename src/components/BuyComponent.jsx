"use client";
import React, { useEffect, useMemo, useState } from "react";
import InputWithSeparator from "./InputWithSeparator";

export default function BuyComponent() {
  const [clientId, setClientId] = useState("");
  const [giveCurrency, setGiveCurrency] = useState("USDT");
  const [giveAmount, setGiveAmount] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [receiveCurrency, setReceiveCurrency] = useState("AMD");
  const [receiveAmount, setReceiveAmount] = useState("");
  const [realGivenAmount, setRealGivenAmount] = useState("");
  const [percent, setPercent] = useState("0.5");
  const [whereAmountGo, setWhereAmountGo] = useState("");
  const [fromWhereLeft, setFromWhereLeft] = useState("");

  const [clients, setClients] = useState([]);
  const [courses, setCourses] = useState([]);
  const [balances, setBalances] = useState([]);

  const [lastChanged, setLastChanged] = useState("give"); // track who changed last

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const [clientsRes, coursesRes, balancesRes] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/courses"),
        fetch("/api/balances"),
      ]);
      setClients(await clientsRes.json());
      const fetchedCourses = await coursesRes.json();
      setCourses(fetchedCourses);
      setBalances(await balancesRes.json());
    };
    fetchData();
  }, []);

  // Prepare rates lookup
  const RATES = useMemo(() => {
    const result = {};
    for (let course of courses) {
      result[course.name] = { buy: course.buy, sell: course.sell };
    }
    if (!result["USDT"] && result["USD"]) {
      result["USDT"] = {
        buy: result["USD"].buy,
        sell: result["USD"].sell,
      };
    }
    return result;
  }, [courses]);

  // Auto-set receiveCurrency
  useEffect(() => {
    if (giveCurrency === "USDT") {
      setReceiveCurrency("AMD");
    }
    if (giveCurrency === "USD" && receiveCurrency === "USDT") {
      setPercent("1");
    }
  }, [giveCurrency, receiveCurrency]);

  // Core calculation
  const calculateFromGive = (amount) => {
    if (!RATES[giveCurrency] || !amount) return { receive: "", rate: 0 };

    const amountNum = parseFloat(amount);
    let rate = RATES[giveCurrency].buy;
    if (giveCurrency === "USDT") {
      rate *= 1 - parseFloat(percent) / 100;
    }

    const amountAMD = amountNum * rate;
    let amountConvertedToUsdt;
    let actualRate;

    if (giveCurrency === "USD") {
      amountConvertedToUsdt = amountNum * (1 - parseFloat(percent) / 100);
      actualRate = amountConvertedToUsdt / amountNum;
    } else {
      let adjustedRate;
      if (receiveCurrency === "USDT") {
        adjustedRate = RATES["USD"].sell * (1 + parseFloat(percent) / 100);
      } else {
        adjustedRate = RATES["USD"].sell * 1.005;
      }
      amountConvertedToUsdt = amountAMD / adjustedRate;
      actualRate =
        receiveCurrency === "AMD" ? rate : amountConvertedToUsdt / amountNum;
    }

    const receive =
      receiveCurrency === "AMD"
        ? amountAMD.toFixed(2)
        : amountConvertedToUsdt.toFixed(2);

    return { receive, rate: actualRate };
  };

  const calculateFromReceive = (amount) => {
    if (!RATES[giveCurrency] || !amount) return { give: "", rate: 0 };

    const amountNum = parseFloat(amount);
    let rate = RATES[giveCurrency].buy;
    if (giveCurrency === "USDT") {
      rate *= 1 - parseFloat(percent) / 100;
    }

    let giveVal;
    let actualRate;

    if (receiveCurrency === "AMD") {
      giveVal = amountNum / rate;
      actualRate = rate;
    } else {
      let adjustedRate;
      if (receiveCurrency === "USDT") {
        adjustedRate = RATES["USD"].sell * (1 + parseFloat(percent) / 100);
      } else {
        adjustedRate = RATES["USD"].sell * 1.005;
      }
      const amdAmount = amountNum * adjustedRate;
      giveVal = amdAmount / rate;
      actualRate = amountNum / giveVal;
    }

    return { give: giveVal.toFixed(2), rate: actualRate };
  };

  // Sync amounts
  useEffect(() => {
    if (lastChanged === "give") {
      const { receive, rate } = calculateFromGive(giveAmount);
      setReceiveAmount(receive);
      setExchangeRate(rate);
    } else if (lastChanged === "receive") {
      const { give, rate } = calculateFromReceive(receiveAmount);
      setGiveAmount(give);
      setExchangeRate(rate);
    }
  }, [
    giveAmount,
    receiveAmount,
    giveCurrency,
    receiveCurrency,
    percent,
    RATES,
    lastChanged,
  ]);

  // Donation calculation
  const donation = useMemo(() => {
    if (!receiveAmount || !realGivenAmount) return "";
    const diff = parseFloat(receiveAmount) - parseFloat(realGivenAmount);
    return diff.toFixed(2);
  }, [receiveAmount, realGivenAmount]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTransaction = {
      clientId,
      type: "buy",
      givenCurrency: giveCurrency,
      givenAmount: parseFloat(giveAmount),
      receivedCurrency: receiveCurrency,
      receivedAmount: parseFloat(receiveAmount) - parseFloat(donation),
      exchangeRate,
      method: "cash",
      percent: giveCurrency === "USDT" ? parseFloat(percent) : 0,
      note: donation !== "0.00" ? "donation" : "",
      donation: parseFloat(donation) || 0,
      whereAmountGo: giveCurrency === "USDT" ? whereAmountGo : "",
      fromWhereLeft: receiveCurrency === "USDT" ? fromWhereLeft : "",
    };

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction),
    });

    if (res.ok) {
      const saved = await res.json();
      setGiveAmount("");
      setReceiveAmount("");
      setRealGivenAmount("");
      setPercent("0.5");
      setWhereAmountGo("");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("balances:refetch"));
      }
    } else {
      alert("Failed to submit transaction");
    }
  };

  const balancesValues = balances
    .map((balance) => balance.name)
    .filter((name) => !["Casa", "Safe"].includes(name));

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-gray-900 text-white rounded shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4 border border-gray-700 p-4 rounded">
          {/* Give */}
          <div>
            <label className="block mb-1">Amount</label>
            <div className="flex gap-2">
              <select
                value={giveCurrency}
                onChange={(e) => setGiveCurrency(e.target.value)}
                className="w-1/3 rounded bg-gray-700 p-2"
              >
                {courses.map((course) => (
                  <option key={course.name} value={course.name}>
                    {course.name}
                  </option>
                ))}
                {!courses.find((c) => c.name === "USDT") && (
                  <option value="USDT">USDT</option>
                )}
              </select>
              <InputWithSeparator
                value={giveAmount}
                onChange={(val) => {
                  setGiveAmount(val);
                  setLastChanged("give");
                }}
                className="w-2/3 rounded bg-gray-700 p-2"
                placeholder="Amount"
                required
              />
              {giveCurrency === "USDT" && (
                <select
                  value={whereAmountGo}
                  onChange={(e) => setWhereAmountGo(e.target.value)}
                  className="w-1/3 rounded bg-gray-700 p-2"
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

          {/* Percent */}
          {(giveCurrency === "USDT" ||
            (giveCurrency === "USD" && receiveCurrency === "USDT") ||
            (giveCurrency === "AMD" && receiveCurrency === "USDT")) && (
            <div>
              <label className="block mb-1">Custom Percentage (%)</label>
              <InputWithSeparator
                value={percent}
                onChange={(val) => setPercent(val)}
                className="w-full rounded bg-gray-700 p-2"
                placeholder="Percent"
              />
            </div>
          )}

          {/* Receive */}
          <label className="block mb-1">To give back</label>
          <div className="flex gap-2">
            <select
              value={receiveCurrency}
              onChange={(e) => setReceiveCurrency(e.target.value)}
              className="w-1/3 rounded bg-gray-700 p-2"
            >
              {giveCurrency !== "USDT" && <option value="USDT">USDT</option>}
              <option value="AMD">AMD</option>
            </select>
            <InputWithSeparator
              value={receiveAmount}
              onChange={(val) => {
                setReceiveAmount(val);
                setLastChanged("receive");
              }}
              className="w-2/3 rounded bg-gray-700 p-2"
              placeholder="Amount"
              required
            />
            {receiveCurrency === "USDT" && (
              <select
                value={fromWhereLeft}
                onChange={(e) => setFromWhereLeft(e.target.value)}
                className="w-1/3 rounded bg-gray-700 p-2"
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

        {/* Real given */}
        <div>
          <label className="block mb-1">Actual Given Amount</label>
          <InputWithSeparator
            value={realGivenAmount}
            onChange={setRealGivenAmount}
            className="w-full rounded bg-gray-700 p-2"
            placeholder="Amount"
            required
          />
        </div>

        {/* Donation */}
        <div>
          <label className="block mb-1">Donation</label>
          <InputWithSeparator
            value={donation}
            readOnly
            className="w-full rounded bg-gray-700 p-2 text-gray-400"
          />
        </div>

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
