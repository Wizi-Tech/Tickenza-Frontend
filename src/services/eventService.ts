import axios from "axios"

const API_BASE = "https://tickenza-backend-production.up.railway.app"

export const EventService = {
  getAll: () => axios.get(`${API_BASE}/events`),

  create: (data: any) =>
    axios.post(`${API_BASE}/events`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    }),

  uploadImage: (formData: FormData) =>
    axios.post(`${API_BASE}/uploads`, formData, {
      headers: {
        // ✅ Correct header for file upload
        "Content-Type": "multipart/form-data",
      },
    }),
}
