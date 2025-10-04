import API from "./api"
import { Event, EventPayload, UploadResponse } from "@/types/event"

export const EventService = {
  getAll: () => API.get<Event[]>("/events"),
  create: (data: EventPayload) => API.post<Event>("/events", data),
  uploadImage: (formData: FormData) => API.post<UploadResponse>("/uploads", formData),
}
