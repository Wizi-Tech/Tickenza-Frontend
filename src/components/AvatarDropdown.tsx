"use client";

import { useState } from "react";

interface Props {
  onLogout: () => void;
}

export default function AvatarDropdown({ onLogout }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"
      >
        <span className="font-bold text-gray-700">U</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-md border">
          <button
            onClick={onLogout}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}