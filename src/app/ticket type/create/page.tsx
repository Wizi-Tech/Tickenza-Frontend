"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";
const CreateTicketType = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !quantity) {
      toast.error("Please fill all fields!");
      return;
    }
    try {
      const payload = {
        name,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        event_id: eventId ? parseInt(eventId) : 1,
      };
      const res = await API.post("/tickettypes", payload);
      if (res.status === 201 || res.status === 200) {
        toast.success("Ticket Type Created Successfully!");
        setTimeout(() => router.push("/ticket-type"), 1000);
      } else {
        toast.error("Failed to create ticket type.");
      }
    } catch (error: any) {
      console.error("Create Ticket Error:", error);
      toast.error(error.response?.data?.message || "Server error!");
    }
  };
  return (
    <div className="p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Create Ticket Type</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-medium mb-1">Ticket Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="Enter ticket name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Ticket Price</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Enter ticket price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Quantity</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Enter ticket quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => router.push("/ticket-type")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTicketType;
