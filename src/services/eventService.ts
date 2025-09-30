import API from "./api";

export const EventService = {
  getAll: () => API.get("/events"),
  create: (data: FormData) =>
    API.post("/events", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
};
