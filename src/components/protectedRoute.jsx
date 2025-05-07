
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { Spin } from 'antd';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  

  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Tarkistetaan käyttöoikeuksia..." />
      </div>
    );
  }


  if (!user) {

    return <Navigate to="/kirjaudu" />;
  }

  if (adminOnly) {
    
    if (user.rooli !== 'admin') {
      return <Navigate to="/" />;
    }
    
  }
    return children;
};

export default ProtectedRoute;