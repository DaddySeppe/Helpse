import { Link } from "react-router-dom";
import { date, euro } from "../utils/format";
import Button from "./Button";

export default function TaskCard({ task }) {
  return (
    <article className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {task.category}
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-950">{task.title}</h3>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
          {task.status}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-slate-600">{task.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
        <p>Locatie: {task.location}</p>
        <p>Datum: {date(task.task_date)}</p>
        <p className="col-span-2 font-semibold text-slate-950">Budget: {euro(task.price)}</p>
      </div>
      <Link to={`/tasks/${task.id}`} className="mt-4 block">
        <Button className="w-full">Bekijk details</Button>
      </Link>
    </article>
  );
}
