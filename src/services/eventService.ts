import API from "./api"

export const EventService = {
  getAll: () => API.get("/events"),

  create: (data: any) =>
    API.post("/events", data, {
      headers: {
        "Content-Type": "application/json",
      },
    }),

  // 🆕 Add this method for file upload
  uploadImage: (formData: FormData) =>
    API.post("/uploads", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
}
