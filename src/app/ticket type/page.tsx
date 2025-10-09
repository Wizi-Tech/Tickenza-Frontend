"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { TicketService } from "@/services/ticketService";

type Ticket = {
  type_name: string;
  price: string;
  total_quantity: string;
};

export default function TicketTypePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const eventId = searchParams.get("event_id");

  const [tickets, setTickets] = useState<Ticket[]>([
    { type_name: "Normal", price: "", total_quantity: "" },
    { type_name: "VIP", price: "", total_quantity: "" },
    { type_name: "Student", price: "", total_quantity: "" },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (index: number, field: keyof Ticket, value: string) => {
    const updated = [...tickets];
    updated[index][field] = value;
    setTickets(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventId) {
      toast.error("Event ID is missing!");
      return;
    }

    setIsLoading(true);
    try {
      for (const ticket of tickets) {
        const price = Number(ticket.price);
        const quantity = Number(ticket.total_quantity);

        if (!price || !quantity) {
          toast.error(`Invalid values for ${ticket.type_name} ticket`);
          continue;
        }

        await TicketService.create({
          event_id: Number(eventId),
          type_name: ticket.type_name,
          price,
          total_quantity: quantity,
        });
      }

      toast.success("Ticket types saved successfully!");
      router.push("/events");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save tickets");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-[400px] space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Create Ticket Types</h2>

        {tickets.map((ticket, index) => (
          <div key={index} className="border p-3 rounded-md space-y-2">
            <h3 className="font-semibold">{ticket.type_name} Ticket</h3>
            <Input
              type="number"
              placeholder="Price"
              value={ticket.price}
              onChange={(e) => handleChange(index, "price", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Total Quantity"
              value={ticket.total_quantity}
              onChange={(e) =>
                handleChange(index, "total_quantity", e.target.value)
              }
            />
          </div>
        ))}

        <Button type="submit" className="w-full bg-blue-600 text-white" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Tickets"}
        </Button>
      </form>
    </div>
  );
}
