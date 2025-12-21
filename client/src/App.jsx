import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/SignUp";
import Loading from "./components/common/Loading";
import NotFound from "./components/common/NotExist";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in when app mounts
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  const PublicRoute = ({ children }) => {
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };

  return (
    <div>
      {loading && <Loading />}
      {!loading && (
        <Routes>
          {/* Public Routes - only accessible when NOT logged in */}
          <Route path="/login" element={
            <PublicRoute>
              <Login setUser={setUser} setLoading={setLoading} />
            </PublicRoute>
          } />

          <Route path="/signup" element={
            <PublicRoute>
              <Signup setUser={setUser} setLoading={setLoading} />
            </PublicRoute>
          } />

          {/* Protected Route - only accessible when logged in */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard user={user} setLoading={setLoading} />
            </ProtectedRoute>
          } />

          {/* Default route redirects based on auth status */}
          <Route path="/" element={
            user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />

          {/* Optional: 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  );
}

export default App;