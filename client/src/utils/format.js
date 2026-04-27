export function euro(value) {
  const number = Number(value || 0);
  return new Intl.NumberFormat("nl-BE", {
    style: "currency",
    currency: "EUR",
  }).format(number);
}

export function date(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("nl-BE", {
    dateStyle: "medium",
  }).format(new Date(value));
}
