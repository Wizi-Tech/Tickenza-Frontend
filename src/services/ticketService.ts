import API from "./api";

export const TicketService = {
  create: (payload: any) => API.post("/tickets", payload),
};
