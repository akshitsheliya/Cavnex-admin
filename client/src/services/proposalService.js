import api from "../config/api";

const proposalService = {
  getProposals: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/proposals?${queryString}`);
    return response.data;
  },

  getProposal: async (id) => {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  },

  createProposal: async (proposalData) => {
    const response = await api.post("/proposals", proposalData);
    return response.data;
  },

  updateProposal: async (id, proposalData) => {
    const response = await api.put(`/proposals/${id}`, proposalData);
    return response.data;
  },

  deleteProposal: async (id) => {
    const response = await api.delete(`/proposals/${id}`);
    return response.data;
  },

  updateStatus: async (id, status, rejectionReason = null) => {
    const response = await api.patch(`/proposals/${id}/status`, {
      status,
      rejectionReason,
    });
    return response.data;
  },

  duplicateProposal: async (id) => {
    const response = await api.post(`/proposals/${id}/duplicate`);
    return response.data;
  },

  getProposalStats: async () => {
    const response = await api.get("/proposals/stats");
    return response.data;
  },

  createFromCalculator: async (calculatorData) => {
    const response = await api.post(
      "/proposals/from-calculator",
      calculatorData
    );
    return response.data;
  },
};

export default proposalService;
