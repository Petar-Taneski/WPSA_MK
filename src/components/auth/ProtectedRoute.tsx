import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../providers/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Additional security check: verify the Firebase token is still valid
  useEffect(() => {
    if (user) {
      user
        .getIdToken(true) // Force refresh to check if token is still valid
        .then(() => {
          setTokenValid(true);
        })
        .catch((error) => {
          console.error("Token validation failed:", error);
          setTokenValid(false);
        });
    }
  }, [user]);

  if (loading || (user && tokenValid === null)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || tokenValid === false) {
    // Redirect to login page with the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
