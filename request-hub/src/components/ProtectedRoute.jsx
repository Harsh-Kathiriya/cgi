import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    console.log("User not authenticated, redirecting to landing page");
    return <Navigate to="/" />;
  }

  return children;
}