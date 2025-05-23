const SquareIcon = ({ fill = "currentColor", size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={fill}
    className={`lucide lucide-square-icon lucide-square ${className}`}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
  </svg>
);

export default SquareIcon;
