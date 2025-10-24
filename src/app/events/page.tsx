"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const MAX_FILE_SIZE = 500 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];
const createEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  venue: z.string().min(1, "Venue is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  capacity: z.string().min(1, "Capacity is required"),
  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required")
    .refine((file) => file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type), "Only PNG/JPEG format allowed")
    .refine((file) => file instanceof File && file.size <= MAX_FILE_SIZE, "File must be ≤ 500KB"),
});
const editEventSchema = z.object({
  name: z.string().min(1, "Event name is required"),
  venue: z.string().min(1, "Venue is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  capacity: z.string().min(1, "Capacity is required"),
  image: z
    .any()
    .optional()
    .refine(
      (file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Only PNG/JPEG format allowed"
    )
    .refine(
      (file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
      "File must be ≤ 500KB"
    ),
});

const AddEditEvent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const isEdit = !!id;

  const schemaToUse = isEdit ? editEventSchema : createEventSchema;

  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    venue: "",
    date: "",
    time: "",
    capacity: "",
    image: null,
    image_url: "",
  });

  type EventFormInputs = z.infer<typeof schemaToUse>;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<EventFormInputs>({
    resolver: zodResolver(schemaToUse),
  });

  useEffect(() => {
    if (isEdit) {
      API.get<EventResponse>(`/events/${id}`)
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
          setValue("name", data.name);
          setValue("venue", data.venue);
          setValue("date", data.date);
          setValue("time", data.time);
          setValue("capacity", data.capacity);
        })
        .catch(() => toast.error("Failed to load event"));
    }
  }, [isEdit, id, setValue]);

  const onSubmit = async (data: EventFormInputs) => {
    setLoading(true);
    try {
      let imageUrl = eventData.image_url || "";
      if (data.image instanceof File) {
        const imgFormData = new FormData();
        imgFormData.append("file", data.image);
        const uploadRes = await API.post<{ image_url: string }>("/upload-image", imgFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.image_url;
      }

      const payload = {
        name: data.name,
        venue: data.venue,
        date: data.date,
        time: data.time,
        capacity: data.capacity,
        image_url: imageUrl,
      };

      if (isEdit) {
        await API.put(`/events/${id}`, payload);
        toast.success("Event updated successfully!");
      } else {
        await API.post("/create-event", payload);
        toast.success("Event created successfully!");
      }

      setTimeout(() => {
        setLoading(false);
        router.push("/events/eventlist");
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setLoading(false);
      if (err.response?.status === 403) {
        toast.error(err.response?.data?.detail || "Only admins can create events");
      } else {
        toast.error("Failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <Toaster />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">{isEdit ? "Edit Event" : "Add New Event"}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input type="text" placeholder="Event Name" {...register("name")} className="w-full border p-2 rounded" />
            <p className="text-red-500 text-sm">{errors.name?.message?.toString()}</p>
          </div>
          <div>
            <input type="text" placeholder="Venue" {...register("venue")} className="w-full border p-2 rounded" />
            <p className="text-red-500 text-sm">{errors.venue?.message?.toString()}</p>
          </div>
          <div className="flex gap-2">
            <div className="w-1/2">
              <input type="date" {...register("date")} className="w-full border p-2 rounded" />
              <p className="text-red-500 text-sm">{errors.date?.message?.toString()}</p>
            </div>
            <div className="w-1/2">
              <input type="time" {...register("time")} className="w-full border p-2 rounded" />
              <p className="text-red-500 text-sm">{errors.time?.message?.toString()}</p>
            </div>
          </div>
          <div>
            <input type="number" placeholder="Capacity" {...register("capacity")} className="w-full border p-2 rounded" />
            <p className="text-red-500 text-sm">{errors.capacity?.message?.toString()}</p>
          </div>
          <div>
            <input type="file" accept="image/png, image/jpeg" {...register("image")} className="w-full border p-2 rounded" />
            <p className="text-red-500 text-sm">{errors.image?.message?.toString()}</p>
          </div>
          {eventData.image_url && !eventData.image && (
            <div className="mt-2">
              <img src={eventData.image_url} alt="Event" className="rounded w-full h-40 object-cover" />
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-2 rounded transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {loading ? "Loading..." : isEdit ? "Update Event" : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEditEvent;
