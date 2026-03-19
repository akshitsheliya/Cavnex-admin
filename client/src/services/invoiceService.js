import api from "../services/api";

const invoiceService = {
  getInvoices: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/invoices?${queryString}`);
    return response.data;
  },

  getInvoice: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },

  createInvoice: async (invoiceData) => {
    const response = await api.post("/invoices", invoiceData);
    return response.data;
  },

  updateInvoice: async (id, invoiceData) => {
    const response = await api.put(`/invoices/${id}`, invoiceData);
    return response.data;
  },

  deleteInvoice: async (id) => {
    const response = await api.delete(`/invoices/${id}`);
    return response.data;
  },

  updateStatus: async (id, status) => {
    const response = await api.patch(`/invoices/${id}/status`, { status });
    return response.data;
  },

  recordPayment: async (id, paymentData) => {
    const response = await api.post(`/invoices/${id}/payment`, paymentData);
    return response.data;
  },

  duplicateInvoice: async (id) => {
    const response = await api.post(`/invoices/${id}/duplicate`);
    return response.data;
  },

  sendInvoice: async (id) => {
    const response = await api.post(`/invoices/${id}/send`);
    return response.data;
  },

  getInvoiceStats: async () => {
    const response = await api.get("/invoices/stats");
    return response.data;
  },
};

export default invoiceService;
