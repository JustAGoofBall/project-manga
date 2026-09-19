/**
 * JWT settings, in one place.
 *
 * The secret used to be written out in two different files. If those two
 * copies ever drifted apart, every token would silently stop verifying,
 * so both the controller and the middleware now read it from here.
 */

// The fallback only exists so the project runs out of the box in development.
// In production you MUST set a real JWT_SECRET environment variable.
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// How long a login stays valid.
const JWT_EXPIRES_IN = '7d';

// Anyone who knows the fallback secret can forge a token for any account,
// and the fallback is public here in the source, so shout about it.
if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  console.warn(
    '\x1b[31m%s\x1b[0m',
    'SECURITY WARNING: JWT_SECRET is not set. The API is running on the ' +
    'public default secret, so anyone can forge login tokens. Set JWT_SECRET ' +
    'in your environment before exposing this server.'
  );
}

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };
