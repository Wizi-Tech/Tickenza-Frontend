"use client";

import React, { useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function SignUpModal() {
  const [isOpen, setIsOpen] = useState(true); 
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("https://tickenza-app.onrender.com/signup", {
        name: formData.name,
        username: formData.username,
        password: formData.password,
      });

      if (res.status === 200) {
        toast.success("Signup completed!");
        setTimeout(() => {
          setIsOpen(false); 
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
      <Toaster position="top-center" />
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

            <h2 className="text-2xl font-bold text-center mb-2">
              Create Account
            </h2>
            <p className="text-gray-500 text-center mb-6">
              Please signup to continue
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-black block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="text-black block mb-1">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label className="text-black block mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>

            <p className="text-center text-gray-600 mt-4 text-sm">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
