export default function EmptyState({ title, subtitle }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-300 bg-white p-8 text-center">
      <h3 className="text-xl font-bold text-brand-900">{title}</h3>
      <p className="mt-2 text-brand-600">{subtitle}</p>
    </div>
  );
}
