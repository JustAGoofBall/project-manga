/**
 * Error Handler Middleware
 * Catches and handles errors that occur in the application
 */

/**
 * 404 Not Found Handler
 * Handles requests to non-existent routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global Error Handler
 * Handles all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  // Use error's status property, or res.statusCode, defaulting to 500
  const statusCode = err.status || err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  
  res.status(statusCode);
  
  res.json({
    success: false,
    message: err.message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
};

module.exports = {
  notFound,
  errorHandler
};
