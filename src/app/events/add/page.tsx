"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import API from "@/services/api";

export default function AddEventPage() {
  const [eventData, setEventData] = useState({
    name: "",
    venue: "",
    date: "",
    time: "",
    capacity: "",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setEventData({ ...eventData, image: files[0] });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(eventData).forEach(([key, value]) => {
        if (value) formData.append(key, value as any);
      });
      await API.post("/create-event", formData);
      toast.success("Event created successfully!");
      setEventData({ name: "", venue: "", date: "", time: "", capacity: "", image: null });
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to create event");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add Event</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-1">Event Name</label>
          <Input name="name" value={eventData.name} onChange={handleChange} placeholder="Enter event name" />
        </div>
        <div>
          <label className="block font-medium mb-1">Venue</label>
          <Input name="venue" value={eventData.venue} onChange={handleChange} placeholder="Enter venue" />
        </div>
        <div>
          <label className="block font-medium mb-1">Date</label>
          <Input type="date" name="date" value={eventData.date} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-medium mb-1">Time</label>
          <Input type="time" name="time" value={eventData.time} onChange={handleChange} />
        </div>
        <div>
          <label className="block font-medium mb-1">Capacity</label>
          <Input type="number" name="capacity" value={eventData.capacity} onChange={handleChange} placeholder="Enter capacity" />
        </div>
        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <Input type="file" name="image" accept="image/*" onChange={handleChange} />
        </div>
        <div className="md:col-span-2 flex gap-4 mt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Create Event</Button>
          <Button type="button" variant="outline" onClick={() => setEventData({ name: "", venue: "", date: "", time: "", capacity: "", image: null })}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
