import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import leadService from "../services/leadService";
import { eventBus, EVENTS } from "../../../server/utils/eventBus";

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
      console.error("❌ Failed to fetch reminders:", err);
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
        eventBus.emit(EVENTS.REMINDER_UPDATED, { leadId, status: "completed" });
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
        eventBus.emit(EVENTS.REMINDER_UPDATED, { leadId, status: "dismissed" });
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
        eventBus.emit(EVENTS.REMINDER_DELETED, { leadId });
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

  // ✅ Initial fetch
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

  // ✅ Auto-refresh every 60 seconds
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

  // ✅ Listen to reminder events from other components
  useEffect(() => {
    const handleReminderUpdate = (data) => {
      fetchReminders(false);
    };

    const handleReminderCreate = (data) => {
      fetchReminders(false);
    };

    const handleReminderDelete = (data) => {
      fetchReminders(false);
    };

    const handleLeadStatusChange = (data) => {
      if (data.status === "proposal_pending") {
        fetchReminders(false);
      }
    };

    eventBus.on(EVENTS.REMINDER_UPDATED, handleReminderUpdate);
    eventBus.on(EVENTS.REMINDER_CREATED, handleReminderCreate);
    eventBus.on(EVENTS.REMINDER_DELETED, handleReminderDelete);
    eventBus.on(EVENTS.LEAD_STATUS_CHANGED, handleLeadStatusChange);

    return () => {
      eventBus.off(EVENTS.REMINDER_UPDATED, handleReminderUpdate);
      eventBus.off(EVENTS.REMINDER_CREATED, handleReminderCreate);
      eventBus.off(EVENTS.REMINDER_DELETED, handleReminderDelete);
      eventBus.off(EVENTS.LEAD_STATUS_CHANGED, handleLeadStatusChange);
    };
  }, [fetchReminders]);

  // ✅ Storage change listener
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
