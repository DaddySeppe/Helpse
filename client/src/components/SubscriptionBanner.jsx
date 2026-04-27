import { expiredMessage, trialMessage } from "../utils/access";
import Button from "./Button";

export default function SubscriptionBanner({ status, onGoPricing }) {
  if (status === "ACTIVE") return null;

  const message = status === "TRIAL" ? trialMessage : expiredMessage;
  const tone =
    status === "TRIAL"
      ? "border-amber-200 bg-amber-50 text-amber-800"
      : "border-red-200 bg-red-50 text-red-800";

  return (
    <div className={`mb-6 rounded-2xl border px-4 py-4 md:flex md:items-center md:justify-between ${tone}`}>
      <p className="font-medium">{message}</p>
      <Button className="mt-3 md:mt-0" variant="secondary" onClick={onGoPricing}>
        Bekijk pricing
      </Button>
    </div>
  );
}
