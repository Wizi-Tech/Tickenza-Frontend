"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
const ticketTypeSchema = z.object({
  name: z.string().min(1, "Ticket name is required"),
  price: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Price cannot be negative")
  ),
  quantity: z.preprocess(
    (val) => Number(val),
    z.number().int().min(0, "Quantity cannot be negative")
  ),
});
type TicketTypeForm = z.infer<typeof ticketTypeSchema>;
interface TicketTypeResponse {
  id: number;
  name: string;
  price: number;
  quantity: number;
  event_id: number;
}

const CreateEditTicketType: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const eventId = searchParams.get("event_id");

  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TicketTypeForm>({
    resolver: zodResolver(ticketTypeSchema)as any,
  });
  const fetchTicketType = async () => {
    if (!isEdit) {
      setFetching(false);
      return;
    }
    setFetching(true);
    try {
      const res = await API.get<TicketTypeResponse>(`/tickettypes/${id}`);
      const data = res.data;
      reset({
        name: data.name,
        price: data.price,
        quantity: data.quantity,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to load ticket details");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTicketType();
  }, [id]);
  const onSubmit = async (data: TicketTypeForm) => {
    setLoading(true);
    try {
      const evId = Number(eventId ?? 0);
      console.log(data,"ak")
      if (!evId) {
        toast.error("Event ID missing. Please open this page from event creation flow.");
        setLoading(false);
        return;
      }

      const payload = {
        name: data.name,
        price: Number(data.price),
        quantity: Number(data.quantity),
        event_id: evId,
      };
      console.log(id,"????",payload)
      if (isEdit) {
        await API.put(`/tickettypes/${id}`, payload);
        toast.success("Ticket Type updated successfully!");
      } else {
        const res = await API.post<TicketTypeResponse>("/tickettypes", payload);
        toast.success("Ticket Type created successfully!");
        console.log("Created:", res.data);
      }

      router.push("/ticket-type/ticketTypeList");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.detail || "Failed to create/update ticket type");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex flex-col gap-4 justify-center items-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-xl font-semibold text-gray-700">Loading ticket details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <Toaster />
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isEdit ? "Edit Ticket Type" : "Create Ticket Type"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Ticket Name"
              {...register("name")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>
          <div>
            <input
              type="number"
              placeholder="Ticket Price"
              {...register("price")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.price?.message}</p>
          </div>
          <div>
            <input
              type="number"
              placeholder="Quantity"
              {...register("quantity")}
              className="w-full border p-2 rounded"
            />
            <p className="text-red-500 text-sm">{errors.quantity?.message}</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-2 rounded transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Loading..." : isEdit ? "Update Ticket Type" : "Create Ticket Type"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditTicketType;
