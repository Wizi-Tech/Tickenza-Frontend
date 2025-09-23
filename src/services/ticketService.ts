import api from "./api"; 

export const TicketService = {
  create: (payload: any) => api.post("/tickets", payload),
};
