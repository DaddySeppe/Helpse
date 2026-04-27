export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: "bg-brand-700 text-white hover:bg-brand-800",
    secondary: "bg-white text-brand-900 border border-brand-200 hover:bg-brand-50",
    accent: "bg-accent-500 text-brand-950 hover:bg-accent-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
