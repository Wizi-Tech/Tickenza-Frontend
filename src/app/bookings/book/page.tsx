"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "@/services/api";
import toast, { Toaster } from "react-hot-toast";

const BookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|in)$/i, "Invalid email"),
});

type FormValues = z.infer<typeof BookingSchema>;
type TicketSelection = {
  ticket_type_id: number;
  name: string;
  price: number;
  remaining_quantity: number;
  quantity: number;
};
export default function BookingFormPage() {
  const router = useRouter();
  const [event, setEvent] = useState<any>(null);
  const [ticketSelections, setTicketSelections] = useState<TicketSelection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
    },
  });

  useEffect(() => {
    const savedEvent = localStorage.getItem("selected_event");
    if (savedEvent) {
      const parsed = JSON.parse(savedEvent);
      setEvent(parsed);
      const selections: TicketSelection[] = (parsed.ticket_types || []).map(
        (t: any) => ({
          ticket_type_id: t.id,
          name: t.name,
          price: t.price,
          remaining_quantity: t.remaining_quantity ?? t.quantity ?? 0,
          quantity: 0,
        })
      );
      setTicketSelections(selections);
    } else {
      router.push("/bookings");
    }
  }, [router]);
  if (!event)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
      </div>
    );
  const totalPrice = ticketSelections.reduce((sum, t) => sum + t.quantity * t.price, 0);
  const totalTickets = ticketSelections.reduce((sum, t) => sum + t.quantity, 0);
  const selectedTickets = ticketSelections.filter((t) => t.quantity > 0);
  const handleQuantityChange = (id: number, rawValue: number) => {
    let value = Number.isNaN(rawValue) ? 0 : Math.floor(rawValue);
    if (value < 0) value = 0;
    const prev = ticketSelections.find((t) => t.ticket_type_id === id);
    const prevQty = prev ? prev.quantity : 0;
    const currentTotal = ticketSelections.reduce((s, t) => s + t.quantity, 0);
    const allowedRemaining = 10 - (currentTotal - prevQty);
    if (value > allowedRemaining) value = allowedRemaining;
    const ticket = ticketSelections.find((t) => t.ticket_type_id === id);
    if (ticket && value > ticket.remaining_quantity) {
      value = ticket.remaining_quantity;
    }
    setTicketSelections((prevList) =>
      prevList.map((t) => (t.ticket_type_id === id ? { ...t, quantity: value } : t))
    );
  };
  const handlePayment = async (formData: FormValues) => {
    const selected = ticketSelections.filter((t) => t.quantity > 0);
    if (selected.length === 0) {
      return;
    }
    if (totalTickets > 10) {
      return;
    }
    for (const t of selected) {
      if (t.quantity > t.remaining_quantity) {
        toast.error(`Only ${t.remaining_quantity} left for ${t.name}.`);
        return;
      }
    }
    const payload = {
      event_id: event.id,
      number_of_tickets: totalTickets,
      tickets: selected.map((t) => ({
        ticket_type_id: t.ticket_type_id,
        quantity: t.quantity,
      })),
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
    };

    try {
      setIsLoading(true);
      const token = localStorage.getItem("access_token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await API.post("/bookings/reserve-event", payload, { headers });
      toast.success("Booking successful!");
      setTimeout(() => router.push("/bookings"), 1500);
    } catch (err: any) {
      const backendError = err.response?.data;
      toast.error(
        backendError?.detail?.[0]?.msg ||
          backendError?.message ||
          "Booking failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Toaster />
      <h1 className="text-2xl font-bold mb-4">Booking for {event.name}</h1>
      <form onSubmit={handleSubmit(handlePayment)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">User Details</h2>
              <label className="block font-medium">Name</label>
              <input
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{String(errors.name.message)}</p>
              )}

              <label className="block mt-3 font-medium">Mobile Number</label>
              <input
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                maxLength={10}
                {...register("mobile")}
              />
              {errors.mobile && (
                <p className="text-red-600 text-sm">{String(errors.mobile.message)}</p>
              )}

              <label className="block mt-3 font-medium">Email</label>
              <input
                className="w-full p-2 border rounded mt-1 bg-blue-50"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{String(errors.email.message)}</p>
              )}
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-3">Select Tickets</h2>
              {ticketSelections.map((t) => {
                const blocked = totalTickets >= 10 && t.quantity === 0; 
                return (
                  <div
                    key={t.ticket_type_id}
                    className="flex items-center justify-between border-b py-3"
                  >
                    <div>
                      <p className="font-medium">
                        {t.name} — ₹{t.price}
                      </p>
                      <p className="text-sm text-gray-500">{t.remaining_quantity} left</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={10}
                        title="You can select up to 10 tickets only"
                        value={t.quantity}
                        onChange={(e) => handleQuantityChange(t.ticket_type_id, Number(e.target.value))}
                        className={`w-20 p-2 border rounded ${blocked ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        disabled={blocked}
                      />
                      <div
                        title=" ⓘ You can select upto 10 tickets only"
                        className="text-gray-500 text-sm select-none"
                        aria-hidden
                      >
                      </div>
                    </div>
                  </div>
                );
              })}
              <p className="mt-4 font-semibold text-lg">Total Tickets: {totalTickets}</p>
              <p className="mt-1 font-semibold text-lg">Total Price: ₹{totalPrice}</p>
            </div>
            <button
              type="submit"
              className="w-full text-white py-3 rounded-lg mt-2 font-semibold bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isLoading || totalTickets === 0}
            >
              {isLoading ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
          <div className="bg-white p-5 rounded-lg shadow h-fit sticky top-10">
            <h2 className="text-lg font-semibold mb-3">Booking Summary</h2>
            <p>
              <strong>Event:</strong> {event.name}
            </p>
            <div className="mt-3 space-y-2">
              {selectedTickets.length === 0 && (
                <p className="text-sm text-gray-500">No tickets selected yet.</p>
              )}
              {selectedTickets.map((t) => (
                <div key={t.ticket_type_id} className="flex justify-between text-sm">
                  <span>
                    {t.name} × {t.quantity}
                  </span>
                  <span>₹{t.quantity * t.price}</span>
                </div>
              ))}
            </div>
            <hr className="my-3" />
            <p className="text-xl font-bold">Total: ₹{totalPrice}</p>
          </div>
        </div>
      </form>
    </div>
  );
}
