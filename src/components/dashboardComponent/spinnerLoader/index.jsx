import './loader.css';

// Existing "large" / "smaller" variants are triggered via className.
// The `inline` prop is the drop-in for MUI's <CircularProgress size="14-17px" />
// that used to live in buttons — 16px, thinner border, uses currentColor so
// it takes the parent's text color (dark on light buttons, white on dark
// buttons) without a manual color prop.
const SpinnerLoader = ({ className = "", inline = false }) => {
  const classes = ["loader", inline ? "inline" : "", className]
    .filter(Boolean)
    .join(" ");
  return <div className={classes} role="status" aria-label="Loading" />;
};

export default SpinnerLoader