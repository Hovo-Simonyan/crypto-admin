import React from "react";
import { formatNumber } from "@/utils/common";

export default function InputWithSeparator({
  value,
  onChange,
  className = "",
  placeholder = "",
  required = false,
}) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/,/g, "");
    onChange(raw);
  };

  return (
    <input
      type="text"
      value={formatNumber(value)}
      onChange={handleChange}
      className={className}
      placeholder={placeholder}
      required={required}
    />
  );
}
