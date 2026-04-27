export function getRemainingTrialTime(trialEndsAt) {
  if (!trialEndsAt) return "-";

  const diff = new Date(trialEndsAt).getTime() - Date.now();
  if (diff <= 0) return "0 dagen";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  return `${days}d ${hours}u`;
}

export function getUserAccess(user) {
  const status = user?.subscription_status;

  if (status === "ACTIVE") {
    return {
      canRead: true,
      canCreateTask: true,
      canApply: true,
      canManage: true,
      mustPay: false,
    };
  }

  if (status === "TRIAL") {
    return {
      canRead: true,
      canCreateTask: false,
      canApply: false,
      canManage: false,
      mustPay: false,
    };
  }

  return {
    canRead: false,
    canCreateTask: false,
    canApply: false,
    canManage: false,
    mustPay: true,
  };
}

export const trialMessage =
  "Je zit in je gratis kijkperiode. Activeer Premium om acties uit te voeren.";

export const expiredMessage =
  "Je trial is verlopen. Activeer je abonnement om verder te gaan.";
