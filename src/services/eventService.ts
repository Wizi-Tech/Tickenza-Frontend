import axios from "axios"

const API_URL = "https://tickenza-app.onrender.com"

export const EventService = {
  create: (data: FormData) =>
    axios.post(`${API_URL}/events`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getAll: () => axios.get(`${API_URL}/events`),
}
