// Simple event bus for app-wide events
class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (!this.events[event]) return;
    this.events[event] = this.events[event].filter((cb) => cb !== callback);
  }

  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  }
}

export const eventBus = new EventBus();

// Event names
export const EVENTS = {
  REMINDER_UPDATED: "reminder:updated",
  REMINDER_CREATED: "reminder:created",
  REMINDER_DELETED: "reminder:deleted",
  LEAD_STATUS_CHANGED: "lead:status_changed",
};
