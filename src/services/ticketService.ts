import API from "./api";
export const TicketTypeService = {
  getAll: () => API.get("/tickettypes"),
  getById: (id: string) => API.get(`/tickettypes/${id}`),
  create: (payload: any) => API.post("/tickettypes", payload),
  update: (id: string, payload: any) => API.put(`/tickettypes/${id}`, payload),
  delete: (id: string) => API.delete(`/tickettypes/${id}`),
};
