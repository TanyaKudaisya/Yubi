import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";

const Pattern = ({ title, subtitle }) => {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 bg-gradient-to-br from-amber-50 to-cyan-100">
        <div className="max-w-md text-center">
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className={`aspect-square rounded-2xl bg-cyan-400/20 
                  ${i % 2 === 0 ? "animate-pulse" : ""}`}
              >
                {i % 3 === 0 && (
                  <svg viewBox="0 0 40 40" className="w-full h-full p-3">
                    <circle cx="20" cy="20" r="18" className="fill-cyan-400/40"/>
                    <circle cx="15" cy="15" r="3" className="fill-cyan-500/40"/>
                    <circle cx="25" cy="15" r="3" className="fill-cyan-500/40"/>
                    <path d="M14,25 Q20,30 26,25" className="stroke-cyan-500/40" fill="none" strokeWidth="2"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold mb-4 text-gray-700">{title}</h2>
          <p className="text-gray-500">{subtitle}</p>
        </div>
      </div>
    );
};
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row items-center justify-center bg-white text-gray-800">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4 text-cyan-700">Sign in to Yubi</h1>
        <p className="text-gray-600 text-center mb-6">Connect with fellow Glbians, privately and directly - your university network simplified</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                className="input bg-gray-100 border border-gray-300 w-full pl-10 py-2 px-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="clg_id@glbitm.ac.in"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                className="input bg-gray-100 border border-gray-300 w-full pl-10 py-2 px-3 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-400 hover:bg-cyan-600 transition rounded-lg py-2 font-semibold flex items-center justify-center"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Loading...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Don&apos;t have an account? <Link to="/signup" className="text-cyan-500 hover:underline">Create account</Link>
        </p>
      </div>

      {/* Right Side - Image/Pattern */}
      <div className="hidden lg:block w-1/2">
        <Pattern
          title={"Welcome back!"}
          subtitle={"Sign in to continue your journey with Yubi."}
        />
      </div>
    </div>
  );
};

export default LoginPage;