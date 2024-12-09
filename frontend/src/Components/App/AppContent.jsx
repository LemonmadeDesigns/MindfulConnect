// src/Components/App/AppContent.jsx
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import { useAuth } from "../Auth/AuthContext";
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Auth/Login";
import Layout from "../Common/Layout";
import MoodAnalytics from "../Visuals/MoodAnalytics";
import Register from "../Auth/Register";
import Resources from "../Resources/Resources";
import SupportGroupsOverview from "../Support/SupportGroupsOverview";

const AppContent = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const handleRegister = () => {
    navigate("/login");
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <Routes>
      <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="support-groups" element={<SupportGroupsOverview />} />
        <Route path="resources" element={<Resources />} /> {/* Add this line */}
        <Route path="analytics" element={<MoodAnalytics />} />
      </Route>

      <Route
        path="/login"
        element={
          !user ? (
            <Login onRegister={() => navigate("/register")} />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
      <Route
        path="/register"
        element={
          !user ? (
            <Register onBackToLogin={() => navigate("/login")} />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppContent;
