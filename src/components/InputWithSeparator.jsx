import React from "react";

export default function InputWithSeparator({
  value,
  onChange,
  className = "",
  placeholder = "",
  required = false,
}) {
  // форматируем число с запятыми
  const formatNumber = (val) => {
    if (!val) return "";
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // убираем запятые для хранения
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
