"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";
interface TicketType {
  ticketTypeId: string;
  ticketTypeName: string;
  ticketPrice: number;
  ticketDescription: string;
}
const TicketTypeList = () => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const fetchTicketTypes = async () => {
    try {
      const response = await API.get("/ticket-types");
      setTicketTypes(response.data as any);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      toast.error("Failed to load ticket types.");
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Are you want to delete this ticket type?")) return;
    try {
      await API.delete(`/ticket-types/${id}`);
      toast.success("Ticket type deleted successfully!");
      fetchTicketTypes();
    } catch (error) {
      console.error("Error deleting ticket type:", error);
      toast.error("Failed to delete ticket type.");
    }
  };

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Ticket Types</h1>
      <div className="mb-4 flex justify-end">
        <Link
          href="/ticket-type/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Ticket Type
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Description</th>
            <th className="border p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ticketTypes.length > 0 ? (
            ticketTypes.map((ticket) => (
              <tr key={ticket.ticketTypeId}>
                <th className="border p-2">{ticket.ticketTypeName}</th>
                <td className="border p-2">₹{ticket.ticketPrice}</td>
                <td className="border p-2">{ticket.ticketDescription}</td>
                <td className="border p-2 text-center flex gap-2 justify-center">
                  <Link
                    href={`/ticket-type/edit/${ticket.ticketTypeId}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(ticket.ticketTypeId)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
                No ticket types found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketTypeList;
