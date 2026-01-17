"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/services/api";

interface Event {
  id: string;
  name: string;
  date: string;
  status?: string;
  image_url?: string;
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/events");
      setEvents(res.data as any);
    } catch (error) {
      console.error("Error loading events");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/admin/events/${id}`);
      alert("Event deleted successfully");
      fetchEvents();
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const searchedEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Event List</h2>

      <div className="flex justify-between mb-4">
        <Link
          href="/events"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Event
        </Link>

        <input
          type="text"
          placeholder="Search event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      {loading ? (
        <div className="flex flex-col items-center py-10 gap-3">
          <span className="h-10 w-10 block border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
          <p className="text-gray-600">Loading...</p>
        </div>
      ) : (
        <table className="w-full border text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Event Name</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {searchedEvents.length > 0 ? (
              searchedEvents.map((event) => (
                <tr key={event.id} className="border-b">
                  <td className="p-2 border">
                    {event.image_url ? (
                      <img
                        src={event.image_url}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>

                  <td className="p-2 border">{event.name}</td>
                  <td className="p-2 border">{event.date}</td>
                  <td className="p-2 border">{event.status || "N/A"}</td>

                  <td className="p-2 border flex gap-2">
                    <Link
                      href={`/events?id=${event.id}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(event.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="text-center p-4" colSpan={5}>
                  No events found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EventList;
