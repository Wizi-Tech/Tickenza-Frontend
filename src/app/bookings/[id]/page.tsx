"use client";

import React, { useEffect, useState } from "react";
import API from "@/services/api";
import { useParams, useRouter } from "next/navigation";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const fetchEvent = async () => {
    try {
      const res = await API.get(`/admin/events/${id}`);
      setEvent(res.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) return <p className="p-6">Event not found</p>;
  const handleBookNow = () => {
    setBookingLoading(true);
    localStorage.setItem("selected_event", JSON.stringify(event));
    router.push("/bookings/book");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="w-full h-60 md:h-72 overflow-hidden rounded-b-xl shadow">
        <img
          src={event.image_url}
          alt="Event Banner"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="max-w-3xl mx-auto px-5 mt-6">
        <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
        <div className="bg-white p-5 rounded-xl shadow space-y-3">
          <p><strong>Venue:</strong> {event.venue}</p>
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Capacity:</strong> {event.capacity}</p>
        </div>

        <div className="mt-6 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3">Available Ticket Types</h2>

          {event.ticket_types?.length > 0 ? (
            <div className="space-y-2">
              {event.ticket_types.map((t: any, index: number) => (
                <div
                  key={index}
                  className="grid grid-cols-3 px-2 py-3 border-b last:border-0 text-gray-700"
                >
                  <span>{t.name}</span>
                  <span className="text-center">₹{t.price}</span>
                  <span className="text-right">Qty: {t.quantity}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No ticket types added.</p>
          )}
        </div>
        <button
          onClick={handleBookNow}
          disabled={bookingLoading}
          className={`mt-8 w-full py-3 rounded-lg text-white font-semibold transition 
            ${
              bookingLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
        >
          {bookingLoading ? (
            <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
          ) : (
            "Book Now"
          )}
        </button>
      </div>
    </div>
  );
}
