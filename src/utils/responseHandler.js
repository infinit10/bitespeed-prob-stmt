module.exports.writeResponse = function writeResponse(res, { success, statusCode, message, data }) {
  let respBody = {
    success,
    ...(message && { message }),
  };

  if (data) {
    respBody = { ...respBody, ...data };
  }

  res.status(statusCode).send(respBody);
};
