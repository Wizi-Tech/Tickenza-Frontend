// services/eventService.ts
import axios from "axios"
import { EventPayload } from "@/types/event"

const API_BASE = "https://tickenza-backend-production.up.railway.app"

export const EventService = {
  getAll: () => axios.get(`${API_BASE}/events`),

  create: (payload: EventPayload) => axios.post(`${API_BASE}/events`, payload),

  uploadImage: (formData: FormData) =>
    axios.post(`${API_BASE}/uploads`, formData, {
      headers: {
        // ❌ Do NOT use application/json
        "Content-Type": "multipart/form-data",
      },
    }),
}
