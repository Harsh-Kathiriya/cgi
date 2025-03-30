import { Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import SnacksPage from "./pages/SnacksPage";
import ManagerDashboard from "./pages/ManagerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={!user ? <Landing /> : <Dashboard />} />
      <Route
        path="/snacks"
        element={
          <ProtectedRoute>
            <SnacksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager"
        element={
          <ProtectedRoute>
            <ManagerDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}