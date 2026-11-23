function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const requestedStatus = err.statusCode || err.status;
  const statusCode =
    Number.isInteger(requestedStatus) &&
    requestedStatus >= 400 &&
    requestedStatus <= 599
      ? requestedStatus
      : 500;

  if (statusCode === 401) {
    res.set("WWW-Authenticate", "Bearer");
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  return res.status(statusCode).json({
    ok: false,
    message:
      statusCode >= 500
        ? "Erro interno do servidor."
        : err.message || "Não foi possível processar a requisição.",
  });
}

module.exports = errorHandler;
