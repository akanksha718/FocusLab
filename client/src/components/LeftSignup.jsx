import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { emailSignup, googleAuth } from "../utils/index";
import { useState } from "react";

const LeftSignup = ({ setUser, setLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setIsSigningUp(true);
    setLoading(true);
    try {
      await emailSignup(email, password);
      setUser({ email });
    } catch (error) {
      alert(error.message || "Sign up failed");
      console.error("Sign up failed:", error);
    } finally {
      setIsSigningUp(false);
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

        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-gray-400 mb-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-500 cursor-pointer hover:text-orange-600 hover:underline transition-all duration-200"
          >
            Sign in here
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
        <label className="block text-sm mb-2">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#1a1a1a] p-3 rounded-lg mb-6 outline-none focus:ring-2 focus:ring-orange-500"
        />

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          disabled={isSigningUp}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 py-3 rounded-lg font-semibold transition-all duration-200"
        >
          {isSigningUp ? "Creating Account..." : "Sign up"}
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
          {isGoogleAuth ? "Signing up..." : "Sign up with Google"}
        </button>

        {/* Footer */}
        <p className="text-xs text-gray-400 mt-6 text-center">
          By signing up, you agree to our{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">Terms & Conditions</span> and{" "}
          <span className="text-blue-500 cursor-pointer hover:underline">Privacy Policy</span>.
        </p>

      </div>
    </div>
  );
};

export default LeftSignup;
