"use client";

import React, { useEffect, useState } from "react";
interface TicketAvailability {
  id: string;
  name: string;
  availableSeats: number;
}
const TicketAvailabilityPage = () => {
  const [tickets, setTickets] = useState<TicketAvailability[]>([]);
  useEffect(() => {
    const dummyData: TicketAvailability[] = [
      { id: "1", name: "VIP", availableSeats: 50 },
      { id: "2", name: "Premium", availableSeats: 100 },
      { id: "3", name: "General", availableSeats: 200 },
    ];
    setTickets(dummyData);
  }, []);

  const handleChange = (id: string, newSeats: number) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === id ? { ...ticket, availableSeats: newSeats } : ticket
      )
    );
  };

  const handleSave = () => {
    alert("Seats update API connect panna porom. Current Data: " + JSON.stringify(tickets));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Update Ticket Availability</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Ticket Type</th>
            <th className="border p-2">Available Seats</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className="border p-2">{ticket.name}</td>
              <td className="border p-2">
                <input
                  type="number"
                  value={ticket.availableSeats}
                  min={0}
                  className="border p-2 w-24"
                  onChange={(e) => handleChange(ticket.id, Number(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleSave}
        className="mt-4 bg-blue-600 text-white px-5 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
};

export default TicketAvailabilityPage;
