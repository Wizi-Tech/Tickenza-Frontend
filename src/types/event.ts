// src/types/event.ts

// ✅ Event object returned from backend
export interface Event {
  id: number
  name: string
  description: string
  event_date: string
  event_time: string
  venue: string
  category: string
  location: string
  image_url: string
  created_at?: string
  updated_at?: string
}

// ✅ Payload used to create a new event
export interface EventPayload {
  name: string
  description: string
  event_date: string
  event_time: string
  venue: string
  category: string
  location: string
  image_url: string
}

// ✅ Response when uploading an image
export interface UploadResponse {
  url: string
}
