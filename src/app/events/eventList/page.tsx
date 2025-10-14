"use client";
import React, { useEffect, useState } from "react";
import API from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import toast from "react-hot-toast";

interface Event {
  id: string;
  name: string;
  event_date: string;
  status: string;
}

export default function EventListPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState({
    name: "",
    date: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { name, date, status } = filters;
      const res = await API.get<Event[]>("/events", {
        params: {
          name: name || undefined,
          date: date || undefined,
          status: status || undefined,
        },
      });
      setEvents(res.data ?? []);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <div className="px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Event List (Admin)</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Input placeholder="Search by event name" name="name" value={filters.name} onChange={handleChange}/>
        <Input type="date" name="date" value={filters.date} onChange={handleChange}/>
        <select name="status" value={filters.status} onChange={handleChange} className="border rounded-md p-2 bg-white text-gray-800">
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <Button onClick={fetchEvents} className="bg-blue-600 text-white">Apply Filters </Button>
      </div>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="shadow-md rounded-xl">
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{event.name}</h2>
                <p className="text-gray-600 text-sm mt-1"> Date: {event.event_date}</p>
                <p className="text-gray-600 text-sm mt-1">
                  Status:{" "}
                  <span className={`font-medium ${ event.status === "upcoming"? "text-green-600": event.status === "completed"? "text-blue-600": "text-red-600" }`} >
                    {event.status}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p>No events found.</p>
      )}
    </div>
  );
}