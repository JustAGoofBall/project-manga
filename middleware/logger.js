const fs = require('fs');
const path = require('path');

/**
 * Logger Middleware
 * Logs HTTP requests to console and file with different log levels
 */

// Log levels: INFO, WARN, ERROR
const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
};

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir) && process.env.NODE_ENV !== 'test') {
  fs.mkdirSync(logsDir);
}

/**
 * Write log to file
 * @param {string} level - Log level (INFO, WARN, ERROR)
 * @param {string} message - Log message
 */
function writeToFile(level, message) {
  // Don't write to file during tests
  if (process.env.NODE_ENV === 'test') return;

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  const logFile = path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`);
  
  fs.appendFile(logFile, logMessage, (err) => {
    if (err) {
      console.error('Failed to write to log file:', err);
    }
  });
}

/**
 * Get color for console output based on status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} ANSI color code
 */
function getStatusColor(statusCode) {
  if (statusCode >= 500) return '\x1b[31m'; // Red
  if (statusCode >= 400) return '\x1b[33m'; // Yellow
  if (statusCode >= 300) return '\x1b[36m'; // Cyan
  if (statusCode >= 200) return '\x1b[32m'; // Green
  return '\x1b[0m'; // Reset
}

/**
 * Get log level based on status code
 * @param {number} statusCode - HTTP status code
 * @returns {string} Log level
 */
function getLogLevel(statusCode) {
  if (statusCode >= 500) return LOG_LEVELS.ERROR;
  if (statusCode >= 400) return LOG_LEVELS.WARN;
  return LOG_LEVELS.INFO;
}

/**
 * Logger middleware
 * Logs incoming requests and outgoing responses
 */
const logger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log incoming request
  const requestLog = `${req.method} ${req.originalUrl || req.url} - IP: ${req.ip}`;
  console.log(`\x1b[36m[REQUEST]\x1b[0m ${requestLog}`);
  writeToFile(LOG_LEVELS.INFO, `REQUEST - ${requestLog}`);
  
  // Log request body for POST, PUT, PATCH
  if (['POST', 'PUT', 'PATCH'].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
    const bodyLog = `Body: ${JSON.stringify(req.body)}`;
    console.log(`\x1b[90m  ${bodyLog}\x1b[0m`);
    writeToFile(LOG_LEVELS.INFO, `  ${bodyLog}`);
  }
  
  // Capture the original res.json to log response
  const originalJson = res.json.bind(res);
  res.json = function(data) {
    const duration = Date.now() - startTime;
    const logLevel = getLogLevel(res.statusCode);
    const color = getStatusColor(res.statusCode);
    
    const responseLog = `${req.method} ${req.originalUrl || req.url} - ${res.statusCode} - ${duration}ms`;
    
    console.log(`${color}[RESPONSE]\x1b[0m ${responseLog}`);
    writeToFile(logLevel, `RESPONSE - ${responseLog}`);
    
    // Log error responses with more detail
    if (res.statusCode >= 400 && data.message) {
      const errorDetail = `Error: ${data.message}`;
      console.log(`  \x1b[31m${errorDetail}\x1b[0m`);
      writeToFile(logLevel, `  ${errorDetail}`);
    }
    
    return originalJson(data);
  };
  
  next();
};

module.exports = logger;
