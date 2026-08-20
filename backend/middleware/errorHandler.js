// Global error-handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Unhandled Error:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected server error occurred.";

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      status: statusCode,
      // If mongoose validation error or others, we can pass detailed errors
      details: err.errors ? Object.keys(err.errors).reduce((acc, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      }, {}) : undefined
    }
  });
};

module.exports = errorHandler;
