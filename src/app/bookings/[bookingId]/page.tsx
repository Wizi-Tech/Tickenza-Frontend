"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface BookingDetails {
  id: string;
  user: string;
  event: string;
  quantity: number;
  price: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  bookingDate: string;
}

const BookingDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  useEffect(() => {
    const dummyBooking: BookingDetails = {
      id: id as string,
      user: "Dharshini",
      event: "Music Concert",
      quantity: 2,
      price: 500,
      totalAmount: 1000,
      paymentStatus: "Paid",
      paymentMethod: "UPI",
      bookingDate: "2025-10-20",
    };

    setBooking(dummyBooking);
  }, [id]);

  if (!booking) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <button
        className="bg-gray-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => router.back()}
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">
        Booking Details - {booking.id}
      </h1>

      <div className="border p-4 rounded-lg shadow-md space-y-3">
        <p><strong>User:</strong> {booking.user}</p>
        <p><strong>Event:</strong> {booking.event}</p>
        <p><strong>Quantity:</strong> {booking.quantity}</p>
        <p><strong>Price Per Ticket:</strong> ₹{booking.price}</p>
        <p><strong>Total Amount:</strong> ₹{booking.totalAmount}</p>
        <p><strong>Payment Status:</strong> {booking.paymentStatus}</p>
        <p><strong>Payment Method:</strong> {booking.paymentMethod}</p>
        <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
      </div>
    </div>
  );
};

export default BookingDetailsPage;
