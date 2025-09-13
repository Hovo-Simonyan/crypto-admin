const NormalIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="limegreen"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="limegreen"
      strokeWidth="2"
      fill="none"
    />
    <path
      fill="limegreen"
      d="M10 14l-2-2 1.41-1.41L10 11.17l4.59-4.59L16 8l-6 6z"
    />
  </svg>
);

const BadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="tomato"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <path d="M1 21h22L12 2 1 21z" />
    <path fill="#fff" d="M12 16v2h0v-2zm0-6v4h0v-4z" />
  </svg>
);

const VipIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="gold"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21z" />
  </svg>
);

export default function ClientStatusIcon({ status }) {
  if (status === "vip") return <VipIcon />;
  if (status === "bad") return <BadIcon />;
  return <NormalIcon />; // default normal
}
