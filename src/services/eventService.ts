import { Event } from "@/types/event";
import API from "./api";

export const EventService = {

  getAll: () => API.get<Event[]>("/events"),

  
  create: (data: any) => API.post<Event>("/events", data),

  
  uploadImage: (formData: FormData) => 
    API.post<{ url: string }>("/upload-image", formData),
};