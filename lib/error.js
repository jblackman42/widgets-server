const { writeToErrorLog } = require('../middleware/logging');

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

const handleError = (err, req, res, responseMessage = "Internal Server Error") => {
  writeToErrorLog(err);  
  createErrorResponse(res, 500, responseMessage);
};

module.exports = {
  handleError,
  createErrorResponse
};