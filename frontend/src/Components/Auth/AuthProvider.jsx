// src/Components/Auth/AuthProvider.jsx
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import PropTypes from "prop-types";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5001/api/auth/verify", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Token verification failed");
      }

      if (data.isValid) {
        setUser(data.user);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      localStorage.removeItem("token");
      setUser(null);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // AuthProvider.jsx - updated the register function
  const register = async (formData) => {
    try {
      console.log("Registration data:", formData); // Add this log
      // Add validation
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json()
      console.log("Registration response:", data); // Add this log

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      // Set token and user data directly from registration response
      localStorage.setItem("token", data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
      throw error;
    }
  };

  // AuthProvider.jsx
  const login = async (email, password) => {
    try {
      if (!email || !password) {
        throw new Error("Please provide both email and password");
      }
      console.log('Making login request to:', 'http://localhost:5001/api/auth/login');

      console.log("Attempting login with:", { email }); // Don't log password

      const response = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Server response status:", response.status);
      const data = await response.json();
      console.log("Server response data:", data);

      if (!response.ok) {
        // More detailed error handling
        if (response.status === 400) {
          throw new Error(data.message || "Invalid email or password");
        } else if (response.status === 404) {
          throw new Error("User not found");
        } else {
          throw new Error(data.message || "Login failed");
        }
      }

      if (!data.token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", data.token);
      setUser(data.user);
      return data;
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        stack: error.stack,
      });
      setError(error.message);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    register,
    error,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
