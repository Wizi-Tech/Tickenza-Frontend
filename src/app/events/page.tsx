"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface EventResponse {
  id?: number;
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

interface CreateEventResponse {
  id?: number;
  event?: {
    id: number;
  };
}

const MAX_FILE_SIZE = 500 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  venue: z.string().min(1, "Venue is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  capacity: z.coerce.number().min(1, "Capacity must be > 0"),
  image: z
    .any()
    .refine((files) => files?.length > 0, "Image is required")
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only PNG/JPEG format allowed"
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File must be ≤ 500 KB"
    ),
});

const editEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  venue: z.string().min(1, "Venue is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  capacity: z.coerce.number().min(1, "Capacity must be > 0"),
  image: z.any().optional(),
});

interface TicketType {
  id: number;
  name: string;
}

const TICKET_TYPES: TicketType[] = [
  { id: 1, name: "Student" },
  { id: 2, name: "General" },
  { id: 3, name: "Silver" },
  { id: 4, name: "Gold" },
  { id: 5, name: "Platinum" },
];

const AddEditEvent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const isEdit = !!id;
  const schemaToUse = isEdit ? editEventSchema : createEventSchema;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    venue: "",
    date: "",
    time: "",
    capacity: "",
    image: null,
    image_url: "",
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedTicketTypeIds, setSelectedTicketTypeIds] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaToUse) as any,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!isEdit) return;
      setFetching(true);
      try {
        const res = await API.get<EventResponse>(`/events/${id}`);
        const data = res.data;
        setEventData({
          ...data,
          image: null,
          image_url: data.image_url || "",
        });
        setValue("name", data.name);
        setValue("venue", data.venue);
        setValue("date", data.date);
        setValue("time", data.time);
        setValue("capacity", Number(data.capacity));
      } catch {
        toast.error("Failed to load event");
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
  }, [isEdit, id, setValue]);

  const toggleTicketType = (id: number) =>
    setSelectedTicketTypeIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      let imageUrl = eventData.image_url;
      if (data.image && data.image.length > 0 && data.image[0] instanceof File) {
        const imgFormData = new FormData();
        imgFormData.append("file", data.image[0]);
        const uploadRes = await API.post<{ image_url: string }>(
          "/upload-image",
          imgFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        imageUrl = uploadRes.data.image_url;
      }

      const payload = {
        name: data.name,
        venue: data.venue,
        date: data.date,
        time: data.time,
        capacity: Number(data.capacity),
        image_url: imageUrl,
        ticket_type_ids: selectedTicketTypeIds,
      };

      if (isEdit) {
        await API.put(`/events/${id}`, payload);
        toast.success("Event updated successfully!");
        router.push("/events/eventList");
      } else {
        const res = await API.post<CreateEventResponse>("/create-event", payload);
        const eventId = Number(res.data?.id ?? res.data?.event?.id ?? 0);
        if (!eventId) throw new Error("No event id returned from backend");

        toast.success("Event created successfully!");
       router.push(`/ticket-type?event_id=${eventId}`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col gap-4 justify-center items-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xl font-semibold text-gray-700">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <Toaster />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isEdit ? "Edit Event" : "Add New Event"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Event Name"
            {...register("name")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.name?.message?.toString()}</p>

          <input
            type="text"
            placeholder="Venue"
            {...register("venue")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.venue?.message?.toString()}</p>

          <div className="flex gap-2">
            <div className="w-1/2">
              <input
                type="date"
                {...register("date")}
                min={new Date().toISOString().split("T")[0]}
                className="w-full border p-2 rounded"
              />
              <p className="text-red-500 text-sm">{errors.date?.message?.toString()}</p>
            </div>
            <div className="w-1/2">
              <input
                type="time"
                {...register("time")}
                className="w-full border p-2 rounded"
              />
              <p className="text-red-500 text-sm">{errors.time?.message?.toString()}</p>
            </div>
          </div>

          <input
            type="number"
            placeholder="Capacity"
            {...register("capacity")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.capacity?.message?.toString()}</p>

          <input
            type="file"
            accept="image/png, image/jpeg"
            {...register("image")}
            className="w-full border p-2 rounded"
          />
          <p className="text-red-500 text-sm">{errors.image?.message?.toString()}</p>

          {eventData.image_url && !eventData.image && (
            <img
              src={eventData.image_url}
              alt="Event"
              className="rounded w-full h-40 object-cover mt-2"
            />
          )}

          <div className="relative mt-4" ref={dropdownRef}>
            <label className="font-semibold mb-1 block">Select Ticket Types:</label>
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full border p-2 rounded text-left flex justify-between items-center cursor-pointer"
            >
              {selectedTicketTypeIds.length > 0
                ? TICKET_TYPES.filter((t) => selectedTicketTypeIds.includes(t.id))
                    .map((t) => t.name)
                    .join(", ")
                : "Select Ticket Types"}
              <svg
                className={`w-4 h-4 ml-2 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-60 overflow-auto">
                {TICKET_TYPES.map((type) => (
                  <label
                    key={type.id}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTicketTypeIds.includes(type.id)}
                      onChange={() => toggleTicketType(type.id)}
                      className="mr-2"
                    />
                    {type.name}
                  </label>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-2 rounded mt-4 transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Loading..." : isEdit ? "Update Event" : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditEvent;
