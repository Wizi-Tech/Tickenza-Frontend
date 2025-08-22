"use client";

import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://tickenza-app.onrender.com/login", {
        username,
        password,
      });

      if (res.status === 200) {
        toast.success("Login Successful!");
      } else {
        toast.error(res.data?.message || "Invalid credentials");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      toast.error("Server Error! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex justify-center items-center h-screen bg-gray-200">
        <div className="bg-white p-6 rounded shadow w-80 relative">
          <div className="flex justify-center mb-4">
            <img src="/Tickenza.png" alt="Tickenza Logo" className="h-16 w-16 object-contain"/>
          </div>

          <h2 className="text-xl font-bold mb-4 text-center">Welcome to Tickenza</h2>
          <p className="text-m text-gray-600 mb-6 text-center">Please login to continue</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-black block mb-1">User ID</label>
              <input type="text" placeholder="Enter User ID" value={username}onChange={(e) => setUsername(e.target.value)}className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-0 focus:border-gray-700"/>
            </div>

            <div className="mb-3">
              <label className="text-black block mb-1">Password</label>
              <input type="password" placeholder="Enter Password"value={password} onChange={(e) => setPassword(e.target.value)} className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-0 focus:border-gray-700"/>
            </div>

            <button type="submit" disabled={loading} className="bg-blue-500 text-white w-full py-2 rounded disabled:opacity-70">
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          <p className="text-black text-sm text-center mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500">
              signup
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
