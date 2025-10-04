"use client";

import React, { useEffect, useState } from "react";
import { EventService } from "@/services/eventService";
import toast from "react-hot-toast";
import { Event, EventPayload, UploadResponse } from "@/types/event";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const formatDate = (date: string) => {
  if (!date) return "";
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    EventService.getAll()
      .then((res) => setEvents(res.data))
      .catch(() => toast.error("Failed to fetch events"));
  }, []);

  const filteredEvents = events.filter((event) => {
    return (
      event.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? event.category === category : true) &&
      (location ? event.location === location : true)
    );
  });

  // ✅ Handles image upload
  const handleImageUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const res = await EventService.uploadImage(formData);
      const data = res.data as UploadResponse;
      setImageUrl(data.url);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload image");
    }
  };

  // ✅ Handles event creation
  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (!imageUrl) {
      toast.error("Please upload an image first");
      return;
    }

    const payload: EventPayload = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      event_date: formatDate(formData.get("date") as string),
      event_time: formData.get("time") as string,
      venue: formData.get("venue") as string,
      category: category || "General",
      location: location || "Unknown",
      image_url: imageUrl,
    };

    try {
      const res = await EventService.create(payload);
      toast.success("Event created successfully!");
      setEvents((prev) => [...prev, res.data]);
      setImageFile(null);
      setImageUrl("");
      e.currentTarget.reset();
    } catch (err) {
      console.error("Create event error:", err);
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Events</h1>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white">+ Create Event</Button>
          </DialogTrigger>
          <DialogContent className="bg-black text-white rounded-lg p-6 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">Create New Event</DialogTitle>
            </DialogHeader>

            <form className="grid gap-4 mt-4" onSubmit={handleCreateEvent}>
              <Input
                name="name"
                placeholder="Event Title"
                className="bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                required
              />
              <Input
                name="date"
                type="date"
                className="bg-gray-800 text-white border-gray-600"
                required
              />
              <Input
                name="time"
                type="time"
                className="bg-gray-800 text-white border-gray-600"
                required
              />
              <Input
                name="venue"
                placeholder="Venue"
                className="bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                className="bg-gray-800 text-white border-gray-600 p-2 rounded-md placeholder-gray-400"
                required
              />

              {/* Image Upload Section */}
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="bg-gray-800 text-white border-gray-600 flex-1"
                />
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  className="bg-blue-600 text-white"
                >
                  Upload
                </Button>
              </div>

              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Uploaded preview"
                  className="w-full h-40 object-cover rounded-md mt-2 border"
                />
              )}

              <Button type="submit" className="bg-blue-600 text-white mt-2">
                Save Event
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-8">
        <Input
          placeholder="Search events..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />

        <Select onValueChange={(val) => setCategory(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Concert">Concerts</SelectItem>
            <SelectItem value="Workshop">Workshops</SelectItem>
            <SelectItem value="Sports">Sports</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => setLocation(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Chennai">Chennai</SelectItem>
            <SelectItem value="Bangalore">Bangalore</SelectItem>
            <SelectItem value="Delhi">Delhi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id} className="overflow-hidden shadow-md rounded-2xl">
              {event.image_url && (
                <img
                  src={event.image_url}
                  alt={event.name}
                  className="w-full h-40 object-cover"
                />
              )}
              <CardContent className="p-4">
                <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                <p className="text-gray-600 text-sm">{event.event_date}</p>
                <p className="text-gray-600 text-sm">{event.event_time}</p>
                <p className="text-gray-600 text-sm">{event.venue}</p>
                <p className="text-gray-500 mt-2 text-sm">{event.description}</p>
                <Button className="mt-4 w-full bg-blue-500 text-white">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
}