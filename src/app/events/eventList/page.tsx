"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import API from "@/services/api";
const EventList = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data as Event[]);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);
  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" || event.status?.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Event List</h2>
      <div className="flex justify-between mb-4">
        <Link href="/events"className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"> Add Event</Link>
        <div className="flex gap-2">
        <input type="text"placeholder="Search event..."value={search}onChange={(e) => setSearch(e.target.value)} className="border p-2 rounded"/>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>
      <table className="w-full border text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Event Name</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <tr key={event.id} className="border-b hover:bg-gray-50">
                <td className="p-2 border">{event.name}</td>
                <td className="p-2 border">{event.date}</td>
                <td className="p-2 border capitalize">
                  {event.status || "N/A"}
                </td>
                <td className="p-2 border">
                  <Link
                    href={`/events?id=${event.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="text-center p-4">
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
