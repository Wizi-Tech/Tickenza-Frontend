"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import API from "@/services/api";

interface EventData {
  name: string;
  venue: string;
  date: string;
  time: string;
  capacity: string;
  image: File | null;
}

export default function AddEditEventPage({ event }: { event?: any }) {
  const isEdit = !!event;
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    venue: "",
    date: "",
    time: "",
    capacity: "",
    image: null,
  });

  useEffect(() => {
    if (isEdit && event) {
      setEventData({
        name: event.name || "",
        venue: event.venue || "",
        date: event.date || "",
        time: event.time || "",
        capacity: event.capacity || "",
        image: null,
      });
    }
  }, [event, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setEventData({ ...eventData, image: files[0] });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", eventData.name);
      formData.append("venue", eventData.venue);
      formData.append("date", eventData.date);
      formData.append("time", eventData.time);
      formData.append("capacity", eventData.capacity);
      if (eventData.image) formData.append("image", eventData.image);

      if (isEdit) {
        await API.put(`/events/${event.id}`, formData);
        toast.success("Event updated successfully!");
      } else {
        await API.post("/create-event", formData);
        toast.success("Event created successfully!");
      }

      if (!isEdit) {
        setEventData({
          name: "",
          venue: "",
          date: "",
          time: "",
          capacity: "",
          image: null,
        });
      }
    } catch (error: any) {
      console.error("Error saving event:", error);
      toast.error(error.response?.data?.detail || "Failed to save event");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? "Edit Event" : "Add Event"}
      </h1>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="block font-medium mb-1">Event Name</label>
          <Input
            name="name"
            value={eventData.name}
            onChange={handleChange}
            placeholder="Enter event name"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Venue</label>
          <Input
            name="venue"
            value={eventData.venue}
            onChange={handleChange}
            placeholder="Enter venue"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Date</label>
          <Input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Time</label>
          <Input
            type="time"
            name="time"
            value={eventData.time}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Capacity</label>
          <Input
            type="number"
            name="capacity"
            value={eventData.capacity}
            onChange={handleChange}
            placeholder="Enter number of attendees"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <Input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
          />
          {eventData.image && (
            <p className="mt-2 text-sm text-gray-500">
              {eventData.image.name}
            </p>
          )}
        </div>

        <div className="md:col-span-2 flex gap-4 mt-4">
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {isEdit ? "Update Event" : "Create Event"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setEventData({
                name: "",
                venue: "",
                date: "",
                time: "",
                capacity: "",
                image: null,
              })
            }
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
