import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import leadService from "../services/leadService";

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [reminders, setReminders] = useState({
    overdue: [],
    today: [],
    upcoming: [],
  });
  const [stats, setStats] = useState({
    overdue: 0,
    today: 0,
    pending: 0,
    completed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  const totalCount = stats.overdue + stats.today;
  const hasNotifications = totalCount > 0;

  const fetchReminders = useCallback(async (showLoading = true) => {
    if (!isMountedRef.current) return;

    try {
      if (showLoading) setLoading(true);
      setError(null);

      const [remindersResponse, statsResponse] = await Promise.all([
        leadService.getReminders(),
        leadService.getReminderStats(),
      ]);

      if (!isMountedRef.current) return;

      if (remindersResponse.success) {
        setReminders(remindersResponse.data);
      }

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      setLastFetched(new Date());
    } catch (err) {
      if (!isMountedRef.current) return;
      console.error("Failed to fetch reminders:", err);
      setError(err.response?.data?.message || "Failed to fetch reminders");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  const markAsCompleted = useCallback(
    async (leadId) => {
      try {
        await leadService.updateReminderStatus(leadId, "completed");
        await fetchReminders(false);
        return { success: true };
      } catch (err) {
        console.error("Failed to mark reminder as completed:", err);
        return { success: false, error: err.response?.data?.message };
      }
    },
    [fetchReminders]
  );

  const markAsDismissed = useCallback(
    async (leadId) => {
      try {
        await leadService.updateReminderStatus(leadId, "dismissed");
        await fetchReminders(false);
        return { success: true };
      } catch (err) {
        console.error("Failed to dismiss reminder:", err);
        return { success: false, error: err.response?.data?.message };
      }
    },
    [fetchReminders]
  );

  const deleteReminder = useCallback(
    async (leadId) => {
      try {
        await leadService.deleteReminder(leadId);
        await fetchReminders(false);
        return { success: true };
      } catch (err) {
        console.error("Failed to delete reminder:", err);
        return { success: false, error: err.response?.data?.message };
      }
    },
    [fetchReminders]
  );

  const openNotifications = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeNotifications = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleNotifications = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const refresh = useCallback(() => {
    fetchReminders(true);
  }, [fetchReminders]);

  useEffect(() => {
    isMountedRef.current = true;

    const token = localStorage.getItem("token");
    if (token) {
      fetchReminders(true);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchReminders]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    intervalRef.current = setInterval(() => {
      fetchReminders(false);
    }, 60000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fetchReminders]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (e.newValue) {
          fetchReminders(true);
        } else {
          setReminders({ overdue: [], today: [], upcoming: [] });
          setStats({
            overdue: 0,
            today: 0,
            pending: 0,
            completed: 0,
            total: 0,
          });
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchReminders]);

  const value = {
    reminders,
    stats,
    loading,
    error,
    lastFetched,
    totalCount,
    hasNotifications,
    isOpen,
    fetchReminders,
    refresh,
    markAsCompleted,
    markAsDismissed,
    deleteReminder,
    openNotifications,
    closeNotifications,
    toggleNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
