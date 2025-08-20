"use client";

import { useState, useEffect } from "react";
import SignInModal from "./SignInModal";
import AvatarDropdown from "./AvatarDropdown";

export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  const handleLoginSuccess = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
      <h1 className="text-2xl font-bold">.fis</h1>

      <div>
        {!isLoggedIn ? (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => setShowModal(true)}
          >
            Sign In
          </button>
        ) : (
          <AvatarDropdown onLogout={handleLogout} />
        )}
      </div>

      <SignInModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </nav>
  );
}