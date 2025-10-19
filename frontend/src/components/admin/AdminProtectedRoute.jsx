import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // Redirect to admin login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Redirect to main site if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
