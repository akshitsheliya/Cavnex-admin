import api from "../services/api";

const leadService = {
  getLeads: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/leads?${queryString}`);
    console.log("📊 leadService.getLeads response:", {
      total: response.data?.pagination?.total,
      count: response.data?.data?.length,
    });

    return response.data;
  },

  getLead: async (id) => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  createLead: async (leadData) => {
    const response = await api.post("/leads", leadData);
    return response.data;
  },

  updateLead: async (id, leadData) => {
    const response = await api.put(`/leads/${id}`, leadData);
    return response.data;
  },

  deleteLead: async (id) => {
    const response = await api.delete(`/leads/${id}`);
    return response.data;
  },

  updateLeadStatus: async (id, status) => {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return response.data;
  },

  convertToClient: async (id) => {
    const response = await api.post(`/leads/${id}/convert`);
    return response.data;
  },

  getLeadStats: async () => {
    const response = await api.get("/leads/stats");
    return response.data;
  },
};

export default leadService;
