export const formatNumber = (val) => {
  if (!val) return "";
  let value = String(val);
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
