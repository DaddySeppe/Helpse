export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-base font-semibold shadow-sm transition duration-200 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: "bg-[color:var(--brand-700)] text-white hover:bg-[color:var(--brand-800)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:rgba(59,92,150,0.18)]",
    secondary: "border border-[color:var(--brand-200)] bg-white text-[color:var(--brand-900)] hover:bg-[color:var(--brand-50)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:rgba(59,92,150,0.08)]",
    accent: "bg-[color:var(--accent-500)] text-[color:var(--brand-900)] hover:bg-[color:var(--accent-600)] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:rgba(71,191,115,0.12)]",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
