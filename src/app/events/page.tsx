"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";
interface EventResponse {
  name: string;
  venue: string;
  date: string;
  time: string;
  capacity: string;
  image_url?: string;
}
interface EventData extends EventResponse {
  image: File | null;
}
const AddEditEvent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const [eventData, setEventData] = useState<EventData>({
    name: "",
    venue: "",
    date: "",
    time: "",
    capacity: "",
    image: null,
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (id) {
      API.get<EventResponse>(`/event/${id}`)
        .then((res) => {
          const data = res.data;
          setEventData({
            name: data.name,
            venue: data.venue,
            date: data.date,
            time: data.time,
            capacity: data.capacity,
            image: null,
            image_url: data.image_url || "",
          });
        })
        .catch(() => toast.error("Failed to load event"));
    }
  }, [id]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setEventData((prev) => ({ ...prev, image: file }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = eventData.image_url || "";
      if (eventData.image) {
        const imgFormData = new FormData();
        imgFormData.append("file", eventData.image);

        const uploadRes = await API.post<{ image_url: string }>(
          "/upload-image",
          imgFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        imageUrl = uploadRes.data.image_url;
      }
      const payload = {
        name: eventData.name,
        venue: eventData.venue,
        date: eventData.date,
        time: eventData.time,
        capacity: eventData.capacity,
        image_url: imageUrl,
      };
      if (id) {
        await API.put(`/event/${id}`, payload); 
        toast.success("Event updated successfully!");
      } else {
        await API.post("/create-event", payload); 
        toast.success("Event created successfully!");
      }
      setTimeout(() => {
        setLoading(false);
        router.push("/events/eventlist");
      }, 1500);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error("create event failed");
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <Toaster />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {id ? "Edit Event" : "Add New Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Event Name"
            value={eventData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={eventData.venue}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <div className="flex gap-2">
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="w-1/2 border p-2 rounded"
              required
            />
            <input
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              className="w-1/2 border p-2 rounded"
              required
            />
          </div>

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={eventData.capacity}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />

          {eventData.image_url && !eventData.image && (
            <div className="mt-2">
              <img
                src={eventData.image_url}
                alt="Event"
                className="rounded w-full h-40 object-cover"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-2 rounded transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "Loading..."
              : id
              ? "Update Event"
              : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditEvent;
