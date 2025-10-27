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

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data as Event[]);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const isConfirmed = confirm("Are you sure to delete this event?");
    if (!isConfirmed) return;

    try {
      await API.delete(`/events/${id}`);
      alert("Event deleted successfully!");
      fetchEvents(); 
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
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
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add Event
        </Link>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
      </div>

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
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="p-2 border">
                  {event.image_url ? (
                    <img
                      src={event.image_url}
                      alt={event.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">No Image</span>
                  )}
                </td>
                <td className="p-2 border">{event.name}</td>
                <td className="p-2 border">{event.date}</td>
                <td className="p-2 border capitalize">{event.status || "N/A"}</td>
                <td className="p-2 border flex gap-2">
                  <Link
                    href={`/events?id=${event.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No events found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;
