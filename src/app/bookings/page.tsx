"use client";

import React, { useEffect, useState } from "react";
import API from "@/services/api";
import { useRouter } from "next/navigation";

export default function BookingPage() {
  const [category, setCategory] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [loadingEventId, setLoadingEventId] = useState<number | null>(null);
  const router = useRouter();
  const categories = ["Movies", "Music", "Sports", "Comedy"];
  const fetchEvents = async (selectedCategory: string) => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedCategory) params.category = selectedCategory;
      const response = await API.get("/events", { params });
      setEvents(response.data || [] as any);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(category);
  }, [category]);

  const handleViewDetails = (eventId: number) => {
    setLoadingEventId(eventId);
    router.push(`/bookings/${eventId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-20 relative">
      <div className="px-6 py-4 shadow-sm bg-white flex justify-between items-center">
        <div className="text-2xl font-bold text-red-600">Event Booking</div>
      </div>
      <div className="flex gap-6 px-6 py-4 bg-white shadow-sm font-medium text-gray-700">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`hover:text-red-600 transition ${
              category === c ? "text-red-600 font-semibold" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {!category && (
        <p className="px-6 mt-6 text-gray-600 text-sm">
          Please select a category to view events.
        </p>
      )}

      <div className="px-6 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading && (
          <div className="w-full flex justify-center mt-10">
            <div className="h-10 w-10 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        )}

        {!loading && events.length === 0 && category && (
          <p className="text-gray-500 text-sm mt-2">No events found.</p>
        )}

        {!loading &&
          events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={event.image_url}
                className="w-full h-56 object-cover rounded-t"
                alt={event.name}
              />

              <div className="p-3">
                <h3 className="text-lg font-semibold">{event.name}</h3>
                <p className="text-gray-600 text-sm">{event.venue}</p>

                <button
                  onClick={() => handleViewDetails(event.id)}
                  disabled={loadingEventId === event.id}
                  className={`mt-3 w-full py-2 rounded-md text-white transition ${
                    loadingEventId === event.id
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-700"
                  }`}
                >
                  {loadingEventId === event.id ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    "View Details"
                  )}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
