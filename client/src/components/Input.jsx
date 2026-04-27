export default function Input({ label, error, className = "", ...props }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-brand-900">{label}</span>
      <input
        className={`w-full rounded-xl border border-brand-200 bg-white px-4 py-3 text-brand-900 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-100 ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </label>
  );
}
