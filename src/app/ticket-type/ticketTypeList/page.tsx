"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";

interface TicketType {
  event_id: any;
  id: number;
  name: string;
  price: number;
  quantity: number;
}
const TicketTypeList = () => {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const fetchTicketTypes = async () => {
    try {
      setLoading(true);
      const response = await API.get("/tickettypes");
      console.log(response.data,"ak")
      setTicketTypes(response.data as TicketType[]);
    } catch (error) {
      console.error("Error fetching ticket types:", error);
      toast.error("Failed to load ticket types.");
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this ticket type?")) return;
    try {
      await API.delete(`/tickettypes/${id}`);
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
      <Toaster />
      <h1 className="text-2xl font-bold text-center mb-4">Ticket Types</h1>

      <div className="mb-4 flex justify-left">
        <Link
          href="/ticket-type"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Ticket Type
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-10 gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Name</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {ticketTypes.length > 0 ? (
              ticketTypes.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="border p-2">{ticket.name}</td>
                  <td className="border p-2">₹{ticket.price}</td>
                  <td className="border p-2">{ticket.quantity ?? "-"}</td>

                  <td className="border p-2 text-center flex gap-2 justify-center">
                    <Link
                      href={`/ticket-type?id=${ticket.id}&event_id=${ticket.event_id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                       Edit
                      </Link>
                    <button
                      onClick={() => handleDelete(ticket.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
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
      )}
    </div>
  );
};

export default TicketTypeList;