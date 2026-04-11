import api from "../services/api";

const agreementService = {
  getAgreements: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/agreements?${queryString}`);
    return response.data;
  },

  getAgreement: async (id) => {
    const response = await api.get(`/agreements/${id}`);
    return response.data;
  },

  createAgreement: async (agreementData) => {
    const response = await api.post("/agreements", agreementData);
    return response.data;
  },

  updateAgreement: async (id, agreementData) => {
    const response = await api.put(`/agreements/${id}`, agreementData);
    return response.data;
  },

  deleteAgreement: async (id) => {
    const response = await api.delete(`/agreements/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.post(`/agreements/${id}/status`, { status });
    return response.data;
  },

  duplicateAgreement: async (id) => {
    const response = await api.post(`/agreements/${id}/duplicate`);
    return response.data;
  },

  getAgreementStats: async () => {
    const response = await api.get("/agreements/stats");
    return response.data;
  },
};

export default agreementService;
