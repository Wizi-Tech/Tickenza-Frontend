"use client";

import React, { useEffect, useState } from "react";
import API from "@/services/api";
import toast,{Toaster} from "react-hot-toast";

interface BookingType {
  id: number;
  user_id: number;
  event_id: number;
  ticket_type_id: number;
  number_of_tickets: number;
  total_amount: number;
  name: string;
  email: string;
  mobile: string;
  payment_status: string;
  booking_status: string;
  booked_at: string;
  event_name?: string;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState<number | null>(null);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await API.get("/bookings/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const bookingList = res.data;

      if (Array.isArray(bookingList)) {
        setBookings(bookingList);
      } else {
        setBookings([]);
      }
    } catch {
      toast.error("Unable to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id: number) => {
    const ok = confirm("Are you sure you want to cancel this booking?");
    if (!ok) return;

    try {
      setCancelLoading(id);

      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login again!");

      await API.delete(`/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Booking cancelled successfully!");
      fetchBookings();
    } catch (err) {
      toast.error("Failed to cancel booking");
    } finally {
      setCancelLoading(null);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg animate-pulse">
        Loading your bookings...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <Toaster/>
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 && (
        <div className="text-gray-500 text-center mt-10 text-lg">
          You have no bookings yet.
        </div>
      )}

      {bookings.map((item) => (
        <div
          key={item.id}
          className="border border-gray-200 p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-blue-700">
              {item.event_name || `Booking #${item.id}`}
            </h2>

            <span
              className={`px-3 py-1 text-sm rounded-full ${
                item.booking_status === "Confirmed"
                  ? "bg-green-100 text-green-700"
                  : item.booking_status === "Cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {item.booking_status}
            </span>
          </div>

          <hr className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 text-gray-700">
            <div className="space-y-2">
              <p><b>Name:</b> {item.name}</p>
              <p><b>Email:</b> {item.email}</p>
              <p><b>Mobile:</b> {item.mobile}</p>
            </div>
            <div className="space-y-2">
              <p><b>Booked On:</b> {new Date(item.booked_at).toLocaleString()}</p>
              <div className="space-y-2">
                <p><b>Booked On:</b> {new Date(item.booked_at).toLocaleString()}</p>
                <p><b>No. of Tickets:</b> {item.number_of_tickets}</p>
                <p><b>Ticket Type ID:</b> {item.ticket_type_id}</p>
                <p><b>Total Amount:</b> ₹{item.total_amount}</p>
                <p>
                  <b>Payment Status:</b>{" "}
                  <span
                    className={`px-2 py-1 text-sm rounded-full ${
                      item.payment_status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.payment_status}
                  </span>
                </p>
              </div>
              <p><b>Total Amount:</b> ₹{item.total_amount}</p>
              <p>
                <b>Payment Status:</b>{" "}
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    item.payment_status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {item.payment_status}
                </span>
              </p>
            </div>
          </div>
          {item.booking_status !== "Cancelled" && (
            <button
              onClick={() => cancelBooking(item.id)}
              disabled={cancelLoading === item.id}
              className={`mt-3 px-4 py-2 rounded-lg text-white ${
                cancelLoading === item.id
                  ? "bg-gray-400"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {cancelLoading === item.id ? "Cancelling..." : "Cancel Booking"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
