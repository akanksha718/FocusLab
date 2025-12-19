import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { resetPassword, emailLogin, googleAuth } from "../utils/index";
import { useState } from "react";

export default function AuthLeft({setUser, setLoading}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address first");
      return;
    }
    setIsResettingPassword(true);
    try {
      await resetPassword(email);
    } catch (error) {
      console.error("Password reset failed:", error);
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }
    setIsSigningIn(true);
    setLoading(true);
    try {
      await emailLogin(email, password);
      setUser({ email });
    } catch (error) {
      alert(error.message || "Sign in failed");
      console.error("Sign in failed:", error);
    } finally {
      setIsSigningIn(false);
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleAuth(true);
    setLoading(true);
    try {
      await googleAuth();
      setUser({ authenticated: true });
    } catch (error) {
      alert(error.message || "Google authentication failed");
      console.error("Google auth failed:", error);
    } finally {
      setIsGoogleAuth(false);
      setLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 flex items-center justify-center px-10">
      <div className="w-full max-w-md">

        <h2 className="text-3xl font-bold mb-2">Sign in</h2>
        <p className="text-gray-400 mb-6">
          Don't have an account yet?{" "}
          <Link
            to="/signup"
            className="text-orange-500 cursor-pointer hover:text-orange-600 hover:underline transition-all duration-200"
          >
            Sign up here
          </Link>
        </p>

        {/* Email */}
        <label className="block text-sm mb-2">Email address</label>
        <input
          type="email"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#1a1a1a] p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Password */}
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm">Password</label>
          <span
            onClick={handleForgotPassword}
            disabled={isResettingPassword}
            className="text-sm text-blue-500 cursor-pointer hover:underline hover:text-blue-600 transition-all duration-200"
          >
            {isResettingPassword ? "Sending..." : "Forgot password?"}
          </span>
        </div>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#1a1a1a] p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={isSigningIn}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 py-3 rounded-lg font-semibold transition-all duration-200"
        >
          {isSigningIn ? "Signing in..." : "Sign in"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-700"></div>
          <span className="px-4 text-gray-400 text-sm">Or continue with</span>
          <div className="flex-grow h-px bg-gray-700"></div>
        </div>

        {/* Google Auth */}
        <button
          onClick={handleGoogleAuth}
          disabled={isGoogleAuth}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:bg-gray-400 text-black py-3 rounded-lg transition-all duration-200"
        >
          <FcGoogle size={22} />
          {isGoogleAuth ? "Signing in..." : "Sign in with Google"}
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6 text-center">
          By signing in, you agree to our{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">Terms & Conditions</span> and{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>.
        </p>

      </div>
    </div>
  );
}
