function getUserAccess(user) {
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

module.exports = {
  getUserAccess,
};
