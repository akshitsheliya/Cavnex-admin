import { useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api";
import leadService from "../services/leadService";
import clientService from "../services/clientService";
import projectService from "../services/projectService";
import invoiceService from "../services/invoiceService";
import { calculateRevenueData } from "../utils/dashboardHelpers";

const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    leads: [],
    clients: [],
    projects: [],
    invoices: [],
  });
  const [stats, setStats] = useState({
    leads: {
      total: 0,
      qualified: 0,
      conversionRate: 0,
      totalValue: 0,
      sourceCounts: {},
      statusCounts: {},
    },
    clients: { total: 0, active: 0 },
    projects: { total: 0, active: 0, completed: 0 },
    revenue: { total: 0, paid: 0, pending: 0 },
  });
  const [revenueData, setRevenueData] = useState({
    monthly: [],
    yearly: [],
    projects: [],
  });
  const fetchedRef = useRef(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [dataResults, statsResults] = await Promise.all([
        Promise.allSettled([
          api.get("/leads?limit=100"),
          api.get("/clients?limit=100"),
          api.get("/projects?limit=100"),
          api.get("/invoices?limit=100"),
        ]),
        Promise.allSettled([
          leadService.getLeadStats(),
          clientService.getClientStats(),
          projectService.getProjectStats(),
          invoiceService.getInvoiceStats(),
        ]),
      ]);

      const extractData = (result) => {
        if (result.status === "fulfilled") {
          const d = result.value.data.data || result.value.data;
          return Array.isArray(d) ? d : [];
        }
        return [];
      };

      const extractStats = (result, defaultVal = {}) => {
        if (result.status === "fulfilled") {
          return result.value.data || defaultVal;
        }
        return defaultVal;
      };

      const leadsData = extractData(dataResults[0]);
      const clientsData = extractData(dataResults[1]);
      const projectsData = extractData(dataResults[2]);
      const invoicesData = extractData(dataResults[3]);

      setData({
        leads: leadsData,
        clients: clientsData,
        projects: projectsData,
        invoices: invoicesData,
      });

      const leadStats = extractStats(statsResults[0], {});
      const clientStats = extractStats(statsResults[1], {});
      const projectStats = extractStats(statsResults[2], {});

      const completedProjects = projectsData.filter(
        (p) => p.status === "completed"
      );
      const totalRevenueFromProjects = completedProjects.reduce(
        (sum, p) => sum + (p.budget || 0),
        0
      );
      const paidAmountFromProjects = completedProjects.reduce(
        (sum, p) => sum + (p.amountPaid || 0),
        0
      );
      const pendingAmountFromProjects =
        totalRevenueFromProjects - paidAmountFromProjects;

      const revenueCalc = calculateRevenueData(completedProjects);
      setRevenueData(revenueCalc);

      setStats({
        leads: {
          total: leadStats.totalLeads || leadsData.length || 0,
          qualified: leadStats.statusCounts?.contacted || 0,
          conversionRate: leadStats.conversionRate || 0,
          totalValue: leadStats.totalValue || 0,
          sourceCounts: leadStats.sourceCounts || {},
          statusCounts: leadStats.statusCounts || {},
        },
        clients: {
          total: clientStats.totalClients || clientsData.length || 0,
          active: clientStats.activeClients || 0,
        },
        projects: {
          total: projectStats.totalProjects || projectsData.length || 0,
          active: projectStats.activeProjects || 0,
          completed:
            projectStats.completedProjects || completedProjects.length || 0,
        },
        revenue: {
          total: totalRevenueFromProjects,
          paid: paidAmountFromProjects,
          pending: pendingAmountFromProjects,
        },
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!fetchedRef.current) {
      fetchedRef.current = true;
      fetchDashboardData();
    }
  }, [fetchDashboardData]);

  const refresh = useCallback(() => {
    fetchedRef.current = false;
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    loading,
    data,
    stats,
    revenueData,
    refresh,
  };
};

export default useDashboardData;
