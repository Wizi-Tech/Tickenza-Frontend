"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Booking {
  id: string;
  user: string;
  event: string;
  status: string;
}

const AllBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const router = useRouter();
  useEffect(() => {
    const dummyBookings: Booking[] = [
      { id: "B001", user: "Dharshini", event: "Music Concert", status: "Confirmed" },
      { id: "B002", user: "Rahul", event: "Tech Fest", status: "Pending" },
      { id: "B003", user: "Sneha", event: "Startup Meetup", status: "Cancelled" },
    ];
    setBookings(dummyBookings);
  }, []);

  const goToDetails = (id: string) => {
    router.push(`/bookings/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Bookings</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Booking ID</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Event</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td className="border p-2">{booking.id}</td>
              <td className="border p-2">{booking.user}</td>
              <td className="border p-2">{booking.event}</td>
              <td className="border p-2">{booking.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => goToDetails(booking.id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllBookingsPage;
