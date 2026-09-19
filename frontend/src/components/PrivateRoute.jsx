import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps a page that requires login.
 *
 * If there is a token we render the page; if not we send the visitor to
 * /login instead. `replace` means the blocked page does not end up in the
 * browser history, so the back button will not bounce them in and out.
 */
export default function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
