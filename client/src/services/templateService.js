import api from "../config/api";

const templateService = {
  getTemplates: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/templates?${queryString}`);
    return response.data;
  },

  getTemplate: async (id) => {
    const response = await api.get(`/templates/${id}`);
    return response.data;
  },

  getTemplateBySlug: async (slug) => {
    const response = await api.get(`/templates/slug/${slug}`);
    return response.data;
  },

  createTemplate: async (templateData) => {
    const response = await api.post("/templates", templateData);
    return response.data;
  },

  updateTemplate: async (id, templateData) => {
    const response = await api.put(`/templates/${id}`, templateData);
    return response.data;
  },

  deleteTemplate: async (id) => {
    const response = await api.delete(`/templates/${id}`);
    return response.data;
  },

  renderTemplate: async (id, data) => {
    const response = await api.post(`/templates/${id}/render`, { data });
    return response.data;
  },

  duplicateTemplate: async (id) => {
    const response = await api.post(`/templates/${id}/duplicate`);
    return response.data;
  },

  getTemplateStats: async () => {
    const response = await api.get("/templates/stats");
    return response.data;
  },

  getDefaultTemplates: async () => {
    const response = await api.get("/templates/defaults");
    return response.data;
  },

  seedDefaultTemplates: async () => {
    const response = await api.post("/templates/seed");
    return response.data;
  },
};

export default templateService;
