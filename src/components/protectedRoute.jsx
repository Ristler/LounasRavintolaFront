
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { Spin } from 'antd';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  console.log("ProtectedRoute: user", user);
  console.log("ProtectedRoute: adminOnly requirement", adminOnly);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Tarkistetaan käyttöoikeuksia..." />
      </div>
    );
  }


  if (!user) {
    console.log("ProtectedRoute: No user, redirecting to login");
    return <Navigate to="/kirjaudu" />;
  }

  if (adminOnly) {
    console.log("ProtectedRoute: Checking admin status - user.rooli =", user.rooli);
    
    if (user.rooli !== 'admin') {
      console.log("ProtectedRoute: Not admin, redirecting");
      return <Navigate to="/" />;
    }
    
    console.log("ProtectedRoute: Admin confirmed, rendering children");
  }
    return children;
};

export default ProtectedRoute;