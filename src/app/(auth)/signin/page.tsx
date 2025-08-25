"use client";

import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function AuthPage({ onClose }: { onClose: () => void }) {
  const [isSignup, setIsSignup] = useState(false); 
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://tickenza-app.onrender.com/login", {
        username,
        password,
      });

      if (res.status === 200) {
        toast.success("Login Successful!");
        onClose(); 
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      toast.error("Server Error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://tickenza-app.onrender.com/signup", {
        name,
        username,
        password,
      });

      if (res.status === 200) {
        toast.success("Signup completed!");
        setTimeout(() => {
          setIsSignup(false);
        }, 2000);
      }
    } catch (err) {
      console.error("Error signing up:", err);
      toast.error("Signup failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)} 
        ></div>
        <div className="relative bg-white p-6 rounded-xl shadow-lg w-96 z-10">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-black"
          >
            X
          </button>
          <div className="flex justify-center mb-4">
            <img
              src="/Tickenza.png"
              alt="Tickenza Logo"
              className="h-16 w-16 object-contain"
            />
          </div>
          <h2 className="text-xl font-bold mb-2 text-center">
            {isSignup ? "Create Account" : "Welcome to Tickenza"}
          </h2>
          <p className="text-m text-gray-600 mb-6 text-center">
            {isSignup ? "Please signup to continue" : "Please login to continue"}
          </p>
          {!isSignup && (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="text-black block mb-1">User Name</label>
                <input
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-3">
                <label className="text-black block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white w-full py-2 rounded disabled:opacity-70 hover:bg-blue-600 transition"
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </form>
          )}

          {isSignup && (
            <form onSubmit={handleSignup}>
              <div className="mb-3">
                <label className="text-black block mb-1">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-0 focus:border-gray-700"
                />
              </div>

              <div className="mb-3">
                <label className="text-black block mb-1">Username</label>
                <input
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-0 focus:border-gray-700"
                />
              </div>

              <div className="mb-3">
                <label className="text-black block mb-1">Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-0 focus:border-gray-700"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 text-white w-full py-2 rounded disabled:opacity-70 hover:bg-blue-600 transition"
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>
          )}

          {/* Toggle */}
          <p className="text-black text-sm text-center mt-4">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignup(false)}
                  className="text-blue-500 underline"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setIsSignup(true)}
                  className="text-blue-500 underline"
                >
                  Signup
                </button>
              </>
            )}
          </p>
        </div>
      </div>
      )}
    </>
  );
}

export default AuthPage;
