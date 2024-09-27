const createErrorResponse = (res, statusCode, details, message = null, isLocalizable = false, values = null, secondaryStatusCode = null) => {
  res.status(statusCode).send({
    StatusCode: statusCode,
    Details: details,
    Message: message,
    IsLocalizable: isLocalizable,
    Values: values,
    SecondaryStatusCode: secondaryStatusCode
  })
}

module.exports = {
  createErrorResponse
};