const { getUserAccess } = require("../utils/access");
const {
  TRIAL_ACTION_MESSAGE,
  EXPIRED_ACTION_MESSAGE,
} = require("../utils/messages");

function ensureCan(accessKey) {
  return (req, res, next) => {
    const access = getUserAccess(req.user);

    if (access[accessKey]) {
      return next();
    }

    if (req.user.subscription_status === "TRIAL") {
      return res.status(403).json({
        message: TRIAL_ACTION_MESSAGE,
        access,
      });
    }

    return res.status(402).json({
      message: EXPIRED_ACTION_MESSAGE,
      access,
    });
  };
}

module.exports = {
  ensureCan,
};
