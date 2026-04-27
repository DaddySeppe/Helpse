function notFoundHandler(req, res) {
  return res.status(404).json({ message: "Route niet gevonden." });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  const status = error.statusCode || 500;
  return res.status(status).json({
    message: error.message || "Er ging iets mis op de server.",
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
