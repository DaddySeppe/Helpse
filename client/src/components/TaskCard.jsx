import { Link } from "react-router-dom";
import { date, euro } from "../utils/format";
import Button from "./Button";

export default function TaskCard({ task }) {
  return (
    <article className="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">
            {task.category}
          </p>
          <h3 className="mt-1 text-xl font-bold text-brand-900">{task.title}</h3>
        </div>
        <span className="rounded-full bg-accent-100 px-3 py-1 text-sm font-semibold text-accent-700">
          {task.status}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-brand-700">{task.description}</p>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-brand-700">
        <p>Locatie: {task.location}</p>
        <p>Datum: {date(task.task_date)}</p>
        <p className="col-span-2 font-semibold text-brand-900">Budget: {euro(task.price)}</p>
      </div>
      <Link to={`/tasks/${task.id}`} className="mt-4 block">
        <Button className="w-full">Bekijk details</Button>
      </Link>
    </article>
  );
}
