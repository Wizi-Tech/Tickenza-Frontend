"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";

const EditTicketType = () => {
  const router = useRouter();
  const { ticketTypeId } = useParams(); 
  const [ticketTypeName, setTicketTypeName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/ticket-types/${ticketTypeId}`);
        const { ticketTypeName, ticketPrice, ticketDescription } = res.data;
        setTicketTypeName(ticketTypeName);
        setTicketPrice(ticketPrice);
        setTicketDescription(ticketDescription);
      } catch (error) {
        console.error("Error fetching ticket type details:", error);
        toast.error("Failed to load ticket type details");
      }
    };
    if (ticketTypeId) fetchData();
  }, [ticketTypeId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTypeName || !ticketPrice || !ticketDescription) {
      toast.error("Please fill in all fields");
      return;
    }
    try {
      await API.patch(`/ticket-types/${ticketTypeId}`, {
        ticketTypeName,
        ticketPrice: parseFloat(ticketPrice),
        ticketDescription,
      });

      toast.success("Ticket type updated successfully!");
      setTimeout(() => router.push("/ticket-type"), 1000);
    } catch (error) {
      console.error("Error updating ticket type:", error);
      toast.error("Failed to update ticket type");
    }
  };
  return (
    <div className="p-6">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Edit Ticket Type</h1> 
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block font-medium">Ticket Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={ticketTypeName}
            onChange={(e) => setTicketTypeName(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Ticket Price</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={ticketPrice}
            onChange={(e) => setTicketPrice(e.target.value)}
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={ticketDescription}
            onChange={(e) => setTicketDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Update
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

export default EditTicketType;
