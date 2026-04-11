import api from "../services/api";

const projectService = {
  getProjects: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/projects?${queryString}`);
    return response.data;
  },

  getProject: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (projectData) => {
    const response = await api.post("/projects", projectData);
    return response.data;
  },

  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  updateProjectStatus: async (id, status) => {
    const response = await api.post(`/projects/${id}/status`, { status });
    return response.data;
  },

  updateProjectProgress: async (id, progress) => {
    const response = await api.post(`/projects/${id}/progress`, { progress });
    return response.data;
  },

  addFeature: async (id, featureData) => {
    const response = await api.post(`/projects/${id}/features`, featureData);
    return response.data;
  },

  updateFeature: async (projectId, featureId, featureData) => {
    const response = await api.put(
      `/projects/${projectId}/features/${featureId}`,
      featureData
    );
    return response.data;
  },

  deleteFeature: async (projectId, featureId) => {
    const response = await api.delete(
      `/projects/${projectId}/features/${featureId}`
    );
    return response.data;
  },

  addMilestone: async (id, milestoneData) => {
    const response = await api.post(
      `/projects/${id}/milestones`,
      milestoneData
    );
    return response.data;
  },

  getProjectStats: async () => {
    const response = await api.get("/projects/stats");
    return response.data;
  },
};

export default projectService;
