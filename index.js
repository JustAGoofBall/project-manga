/**
 * Entry point of the Anime API.
 *
 * This file only WIRES THINGS TOGETHER. Read it top to bottom to see the
 * shape of the whole app; the actual work happens in the folders below.
 *
 * HOW ONE REQUEST TRAVELS THROUGH THE CODE
 *
 *   HTTP request
 *        |
 *        v
 *   middleware/logger.js        writes the request to console + logs/
 *        |
 *        v
 *   rate limiters (below)       blocks callers who hammer the API
 *        |
 *        v
 *   routes/*.js                 matches the URL, checks auth
 *        |
 *        v
 *   controllers/*.js            validates input, decides the response
 *        |
 *        v
 *   models/*.js                 the only place that writes SQL
 *        |
 *        v
 *   config/db.js                the SQLite database
 *
 * If nothing matched, middleware/errorHandler.js turns it into a clean
 * 404 or 500 JSON response instead of an HTML stack trace.
 */

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const apiDocs = require('./config/apiDocs');

// ========== ROUTES ==========
const animeRoutes = require('./routes/anime');
const characterRoutes = require('./routes/characters');
const searchRoutes = require('./routes/search');
const authRoutes = require('./routes/auth');
const ratingRoutes = require('./routes/ratings');
const myRatingsRoutes = require('./routes/myRatings');
const favoriteRoutes = require('./routes/favorites');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// ========== RATE LIMITING ==========
// `skip` turns these off outside production, otherwise the test suite
// would trip the limit and start failing halfway through.
const FIFTEEN_MINUTES = 15 * 60 * 1000;
const onlyInProduction = () => process.env.NODE_ENV !== 'production';

// Normal traffic: 100 requests per 15 minutes per IP.
const generalLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 100,
  skip: onlyInProduction,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Login/register is stricter, because that is what gets brute-forced.
const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 10,
  skip: onlyInProduction,
  message: { success: false, message: 'Too many login attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

// ========== MIDDLEWARE (order matters - this is the order they run in) ==========
app.set('json spaces', 2);          // pretty-print JSON so it is readable in a browser
app.use(cors());                    // let the React frontend call this API
app.use(express.json());            // parse JSON request bodies into req.body
app.use(logger);                    // log every request and response
app.use('/api', generalLimiter);
app.use('/api/auth', authLimiter);  // the stricter limit, on top of the general one

// ========== ENDPOINTS ==========
// GET / - a self-describing index of the API (see config/apiDocs.js)
app.get('/', (req, res) => res.json(apiDocs));

app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/anime/:animeId/characters', characterRoutes);
app.use('/api/anime/:animeId/ratings', ratingRoutes);
app.use('/api/ratings', myRatingsRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);

// ========== ERROR HANDLING (must come last) ==========
app.use(notFound);      // no route matched -> 404
app.use(errorHandler);  // something threw  -> 500 (or the error's own status)

// ========== START THE SERVER ==========
// During tests we only want the `app` object; supertest starts its own server.
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Anime API running on http://localhost:${PORT}`);
    console.log(`API documentation: http://localhost:${PORT}`);
  });
}

module.exports = app;
