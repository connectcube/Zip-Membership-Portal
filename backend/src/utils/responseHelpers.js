const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const sendError = (res, message = 'Internal Server Error', statusCode = 500, details = null) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    ...(details && { details }),
    timestamp: new Date().toISOString()
  });
};

const sendValidationError = (res, errors) => {
  return res.status(400).json({
    success: false,
    error: 'Validation failed',
    details: errors,
    timestamp: new Date().toISOString()
  });
};

const sendNotFound = (res, resource = 'Resource') => {
  return res.status(404).json({
    success: false,
    error: `${resource} not found`,
    timestamp: new Date().toISOString()
  });
};

const sendUnauthorized = (res, message = 'Unauthorized access') => {
  return res.status(401).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};

const sendForbidden = (res, message = 'Access forbidden') => {
  return res.status(403).json({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  });
};

const sendPaginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit)
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
  sendUnauthorized,
  sendForbidden,
  sendPaginated
};