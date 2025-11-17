"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface TicketType {
  name: string;
  price: number | string;
  quantity: number | string;
}

interface EventResponse {
  name: string;
  venue: string;
  date: string;
  time: string;
  capacity: string;
  image_url?: string;
  ticket_types: TicketType[]; 
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
      "File must be ≤ 500KB"
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

const AddEditEvent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const isEdit = !!id;
  const schemaToUse = isEdit ? editEventSchema : createEventSchema;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([
    { name: "", price: "", quantity: "" },
  ]);
  const [eventData, setEventData] = useState<EventData>({
    name: "",
    venue: "",
    date: "",
    time: "",
    capacity: "",
    image: null,
    image_url: "",
    ticket_types: [],
  });

  type EventFormInputs = z.infer<typeof schemaToUse>;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EventFormInputs>({
    resolver: zodResolver(schemaToUse) as any,
  });
  useEffect(() => {
    const fetchEvent = async () => {
      if (!isEdit) return;
      setFetching(true);
      try {
        const res = await API.get<EventResponse>(`/events/${id}`);
        const data = res.data;
        setEventData({
          name: data.name,
          venue: data.venue,
          date: data.date,
          time: data.time,
          capacity: data.capacity,
          image: null,
          image_url: data.image_url || "",
          ticket_types: data.ticket_types || [],
        });
        setValue("name", data.name);
        setValue("venue", data.venue);
        setValue("date", data.date);
        setValue("time", data.time);
        setValue("capacity", Number(data.capacity));
        if (data.ticket_types?.length > 0) {
          setTicketTypes(
            data.ticket_types.map((t) => ({
              ...t,
              price: String(t.price),
              quantity: String(t.quantity),
            }))
          );
        }

      } catch (error) {
        toast.error("Failed to load event");
      } finally {
        setFetching(false);
      }
    };

    fetchEvent();
  }, [isEdit, id, setValue]);
  const addTicketType = () =>
    setTicketTypes([...ticketTypes, { name: "", price: "", quantity: "" }]);
  const removeTicketType = (index: number) => {
    const list = ticketTypes.filter((_, i) => i !== index);
    setTicketTypes(list.length ? list : [{ name: "", price: "", quantity: "" }]);
  };
  const updateTicketType = (index: number, field: keyof TicketType, value: string) => {
    const updated = [...ticketTypes];
    updated[index][field] = value;
    setTicketTypes(updated);
  };
  const onSubmit = async (data: EventFormInputs) => {
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
        ticket_types: ticketTypes
          .filter((t) => t.name && t.price && t.quantity)
          .map((t) => ({
            name: t.name,
            price: Number(t.price),
            quantity: Number(t.quantity),
          })),
      };
      if (isEdit) {
        await API.put(`/events/${id}`, payload);
        toast.success("Event updated successfully!");
      } else {
        await API.post("/create-event", payload);
        toast.success("Event created successfully!");
      }
      setTimeout(() => router.push("/events/eventList"), 500);
    } catch (err: any) {
      console.log(err);
      toast.error("Failed to create event");
    } finally {
      setLoading(false);
    }
  };
  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-lg font-semibold mt-3">Loading event...</p>
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
          <div>
            <input
              type="text"
              placeholder="Event Name"
              {...register("name")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.name?.message?.toString()}</p>
          </div>
          <div>
            <input
              type="text"
              placeholder="Venue"
              {...register("venue")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.venue?.message?.toString()}</p>
          </div>
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
          <div>
            <input
              type="number"
              placeholder="Capacity"
              {...register("capacity")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.capacity?.message?.toString()}</p>
          </div>
          <div>
            <input
              type="file"
              accept="image/png, image/jpeg"
              {...register("image")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.image?.message?.toString()}</p>
          </div>

          {eventData.image_url && (
            <img
              src={eventData.image_url}
              alt="Event"
              className="mt-2 w-full h-40 rounded object-cover"
            />
          )}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Ticket Types</h3>
            {ticketTypes.map((ticket, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={ticket.name}
                  onChange={(e) => updateTicketType(index, "name", e.target.value)}
                  className="border p-2 rounded w-1/3"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={ticket.price}
                  onChange={(e) => updateTicketType(index, "price", e.target.value)}
                  className="border p-2 rounded w-1/3"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={ticket.quantity}
                  onChange={(e) => updateTicketType(index, "quantity", e.target.value)}
                  className="border p-2 rounded w-1/3"
                />
                {ticketTypes.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTicketType(index)}
                    className="bg-blue-600 text-white px-2 rounded">
                    Delete
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addTicketType}
              className="bg-green-600 text-white px-3 py-1 rounded mt-2"
            >
              + Add Ticket Type
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-2 rounded ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
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
