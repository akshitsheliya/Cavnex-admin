import { useEffect, useRef } from "react";
import { message } from "antd";
import useNotifications from "./useNotifications";

const useReminderToast = () => {
  const { stats, reminders } = useNotifications();
  const previousOverdueRef = useRef(0);
  const previousTodayRef = useRef(0);
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    if (isFirstLoadRef.current) {
      previousOverdueRef.current = stats.overdue;
      previousTodayRef.current = stats.today;
      isFirstLoadRef.current = false;

      if (stats.overdue > 0) {
        message.warning({
          content: `You have ${stats.overdue} overdue reminder${stats.overdue > 1 ? "s" : ""}!`,
          duration: 5,
          key: "overdue-reminder",
        });
      }

      if (stats.today > 0) {
        message.info({
          content: `You have ${stats.today} reminder${stats.today > 1 ? "s" : ""} for today!`,
          duration: 5,
          key: "today-reminder",
        });
      }

      return;
    }

    if (stats.overdue > previousOverdueRef.current) {
      const newOverdue = stats.overdue - previousOverdueRef.current;
      message.warning({
        content: `${newOverdue} new overdue reminder${newOverdue > 1 ? "s" : ""}!`,
        duration: 4,
        key: "new-overdue",
      });
    }

    if (stats.today > previousTodayRef.current) {
      const newToday = stats.today - previousTodayRef.current;
      message.info({
        content: `${newToday} new reminder${newToday > 1 ? "s" : ""} for today!`,
        duration: 4,
        key: "new-today",
      });
    }

    previousOverdueRef.current = stats.overdue;
    previousTodayRef.current = stats.today;
  }, [stats.overdue, stats.today]);

  return null;
};

export default useReminderToast;
