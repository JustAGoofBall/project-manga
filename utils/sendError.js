/**
 * One place that turns a thrown Error into an HTTP response.
 *
 * WHY THIS EXISTS
 * Every controller used to repeat the same ~10 lines in its catch block:
 * check for a validation error, check for a duplicate, otherwise 500.
 * That is the same decision every time, so it lives here once.
 *
 * HOW ERRORS CARRY A STATUS
 * The validators (see validators/) throw a normal Error with an extra
 * `.status = 400` property on it. That is the signal "this was the user's
 * fault, not the server's". Anything without a `.status` is treated as an
 * unexpected server/database problem.
 *
 * HOW TO USE IT
 *   } catch (error) {
 *     sendError(res, error);
 *   }
 *
 * @param {import('express').Response} res - Express response object
 * @param {Error} error - The error that was thrown
 * @param {string} [duplicateMessage] - Friendlier text for the 409 case,
 *        e.g. 'An anime with this name already exists'
 */
function sendError(res, error, duplicateMessage = 'This record already exists') {
  // 400 - the request itself was invalid (bad ID, missing name, ...).
  // Validators set error.status to 400 when they reject the input.
  if (error.status === 400) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // 409 - the database rejected the row because it already exists.
  // MySQL and SQLite report this differently, so we check all three spellings.
  const isDuplicate =
    error.code === 'ER_DUP_ENTRY' ||
    error.code === 'SQLITE_CONSTRAINT' ||
    error.message.includes('UNIQUE constraint failed');

  if (isDuplicate) {
    return res.status(409).json({
      success: false,
      message: duplicateMessage
    });
  }

  // 500 - anything we did not anticipate.
  return res.status(500).json({
    success: false,
    message: 'Database error',
    error: error.message
  });
}

module.exports = sendError;
