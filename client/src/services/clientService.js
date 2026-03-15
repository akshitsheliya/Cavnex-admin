import api from "../config/api";

const clientService = {
  getClients: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/clients?${queryString}`);
    return response.data;
  },

  getClient: async (id) => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  createClient: async (clientData) => {
    const response = await api.post("/clients", clientData);
    return response.data;
  },

  updateClient: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData);
    return response.data;
  },

  deleteClient: async (id) => {
    const response = await api.delete(`/clients/${id}`);
    return response.data;
  },

  updateClientStatus: async (id, status) => {
    const response = await api.patch(`/clients/${id}/status`, { status });
    return response.data;
  },

  getClientProjects: async (id) => {
    const response = await api.get(`/clients/${id}/projects`);
    return response.data;
  },

  getClientInvoices: async (id) => {
    const response = await api.get(`/clients/${id}/invoices`);
    return response.data;
  },

  getClientProposals: async (id) => {
    const response = await api.get(`/clients/${id}/proposals`);
    return response.data;
  },

  getClientStats: async () => {
    const response = await api.get("/clients/stats");
    return response.data;
  },
};

export default clientService;
