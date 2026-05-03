export default function EmptyState({ title, subtitle }) {
  return (
    <div className="rounded-[22px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <h3 className="text-xl font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-slate-600">{subtitle}</p>
    </div>
  );
}
