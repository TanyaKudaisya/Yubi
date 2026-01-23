import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import toast from "react-hot-toast";

const TweetyPattern = ({ title, subtitle }) => {
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

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      fullName: "",
      email: "",
      password: "",
    });
    const { signup, isSigningUp } = useAuthStore();

    const validateForm = () => {
        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) signup(formData);
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white shadow-lg">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-20 rounded-full bg-cyan-100 flex items-center justify-center group-hover:bg-cyan-200 transition-colors">
                                <svg viewBox="0 0 40 40" className="size-12 fill-cyan-400">
                                    <circle cx="20" cy="20" r="18" className="fill-cyan-400"/>
                                    <circle cx="15" cy="15" r="3" className="fill-black"/>
                                    <circle cx="25" cy="15" r="3" className="fill-black"/>
                                    <path d="M14,25 Q20,30 26,25" className="stroke-black" fill="none" strokeWidth="2"/>
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold mt-2 text-gray-700">Welcome to Yubi</h1>
                            <p className="text-gray-500">Get started with your free account</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-600">Full Name</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-cyan-500" />
                                </div>
                                <input
                                    type="text"
                                    className="input input-bordered w-full pl-10 bg-amber-50 border-cyan-200 text-gray-700 focus:border-cyan-400 focus:ring-cyan-400"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-600">Email</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-cyan-500" />
                                </div>
                                <input
                                    type="email"
                                    className="input input-bordered w-full pl-10 bg-amber-50 border-cyan-200 text-gray-700 focus:border-cyan-400 focus:ring-cyan-400"
                                    placeholder="clg_id@glbitm.ac.in"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium text-gray-600">Password</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-cyan-500" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="input input-bordered w-full pl-10 bg-amber-50 border-cyan-200 text-gray-700 focus:border-cyan-400 focus:ring-cyan-400"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="size-5 text-cyan-500" /> : <Eye className="size-5 text-cyan-500" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn w-full bg-cyan-400 hover:bg-cyan-500 text-white border-none" disabled={isSigningUp}>
                            {isSigningUp ? <Loader2 className="size-5 animate-spin" /> : "Create Account"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Right Side - TweetyPattern */}
            <TweetyPattern 
                title="Join the Tweety Community"
                subtitle="Connect with friends and share your moments in a fun and safe environment"
            />
        </div>
    );
};

export default SignUpPage;
