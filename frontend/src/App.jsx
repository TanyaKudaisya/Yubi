import React, { useEffect } from "react";
import Navbar from "./components/Navbar";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { useChatStore } from "./store/useChatStore";
import { Loader } from "lucide-react";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

const App = () => {
  const {
    authUser,
    checkAuth,
    isCheckingAuth,
    isSocketConnected,
  } = useAuthStore();

  const {
    subscribeToMessages,
    subscribeToPresence,
    subscribeToReadReceipts,
    getUnreadMessages,
  } = useChatStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Fetch persisted unread messages after authentication
  useEffect(() => {
    if (!authUser) return;

    getUnreadMessages();
  }, [authUser, getUnreadMessages]);

  // Subscribe to real-time messages, presence and read receipts
  useEffect(() => {
    if (!isSocketConnected) return;

    subscribeToMessages();
    subscribeToPresence();
    subscribeToReadReceipts();
  }, [
    isSocketConnected,
    subscribeToMessages,
    subscribeToPresence,
    subscribeToReadReceipts,
  ]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            authUser ? <HomePage /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/signup"
          element={
            !authUser ? <SignUpPage /> : <Navigate to="/" />
          }
        />

        <Route
          path="/login"
          element={
            !authUser ? <LoginPage /> : <Navigate to="/" />
          }
        />

        <Route
          path="/profile"
          element={
            authUser ? <ProfilePage /> : <Navigate to="/login" />
          }
        />
      </Routes>

      <Toaster />
      <Footer />
    </>
  );
};

export default App;