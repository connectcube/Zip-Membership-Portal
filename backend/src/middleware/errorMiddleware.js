const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Firebase Auth errors
  if (err.code === 'auth/id-token-expired') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.code === 'auth/id-token-revoked') {
    statusCode = 401;
    message = 'Token revoked';
  } else if (err.code === 'auth/user-not-found') {
    statusCode = 404;
    message = 'User not found';
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  // Cast errors
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = {
  notFound,
  errorHandler
};