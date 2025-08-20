"use client";

import React, { useState } from "react";

function LoginPage() 
{
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

     try {
      const res = await fetch("/api/login",{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("login response:", data);
      
    } 
    catch (err) {
      console.error("Error logging in:", err);
    }
  };

  return(
    < div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-6 rounded shadow w-80">

        <div className="flex justify-center mb-4"> 
         <img src="/Tickenza.png" alt="Tickenza Logo" className="h-16 w-16 object-contain"/>
        </div>
        
        <h2 className="text-xl font-bold mb-4 text-center"> Welcome to Tickenza</h2>
        <p className="text-m text-gray-600 mb-6 text-center">Please login to continue </p>
 
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-black block mb-1">User ID</label>
            <input type="text" placeholder="Enter User ID" value={username} onChange={(e) => setUsername(e.target.value)} className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-0 focus:border-gray-700"/>
          </div>  
             
          <div className="mb-3">
            <label className="text-black block mb-1">Password</label>
            <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} className="text-gray-700 border w-full p-2 rounded focus:outline-none focus:ring-0 focus:border-gray-700"/>
          </div>

          <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded"> Login</button>
        </form>

        <p className="text-black text-sm text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500">signup</a> 
        </p>
      </div>
    </div>
  );
}

export default LoginPage