"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";

interface EventData {
  name: string;
  venue: string;
  date: string;
  time: string;
  capacity: string;
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
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const openModalHandler = () => setShowModal(true);
    window.addEventListener("openEventModal", openModalHandler);
    return () => window.removeEventListener("openEventModal", openModalHandler);
  }, []);

  useEffect(() => {
    if (id) {
      API.get<EventData>(`/event/${id}`)
        .then((res) => {
          setEventData({
            name: res.data.name,
            venue: res.data.venue,
            date: res.data.date,
            time: res.data.time,
            capacity: res.data.capacity,
            image: null,
          });
          setShowModal(true);
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

    const formData = new FormData();
    formData.append("name", eventData.name);
    formData.append("venue", eventData.venue);
    formData.append("date", eventData.date);
    formData.append("time", eventData.time);
    formData.append("capacity", eventData.capacity);
    if (eventData.image) formData.append("image", eventData.image);

    try {
      if (id) {
        await API.put(`/event/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event updated successfully!");
      } else {
        await API.post("/create-event", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Event created successfully!");
      }

      setTimeout(() => {
        setLoading(false);
        setShowModal(false);
        router.push("/event/eventlist");
      }, 1500);
    } catch (err: any) {
      setLoading(false);
      toast.error("Error while saving event");
      console.error(err);
    }
  };

  return (
    <>
      <Toaster />
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">
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
      )}
    </>
  );
};

export default AddEditEvent;
