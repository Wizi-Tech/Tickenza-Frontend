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

export interface UploadResponse {
  url: string
}
