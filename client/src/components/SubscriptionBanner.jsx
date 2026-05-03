import { expiredMessage, trialMessage } from "../utils/access";
import Button from "./Button";

export default function SubscriptionBanner({ status, onGoPricing }) {
  if (status === "ACTIVE") return null;

  const message = status === "TRIAL" ? trialMessage : expiredMessage;
  const tone =
    status === "TRIAL"
      ? "border-slate-200 bg-slate-50 text-slate-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <div className={`mb-6 rounded-[22px] border px-4 py-4 shadow-sm md:flex md:items-center md:justify-between ${tone}`}>
      <p className="font-medium leading-relaxed">{message}</p>
      <Button className="mt-3 md:mt-0" variant="secondary" onClick={onGoPricing}>
        Bekijk pricing
      </Button>
    </div>
  );
}
