class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(event, handler) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);

    return () => {
      this.listeners[event] = this.listeners[event].filter(
        (h) => h !== handler
      );
    };
  }

  emit(event, data) {
    const handlers = this.listeners[event] || [];
    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`[EventBus] Error in handler for "${event}":`, error);
      }
    });
  }

  removeAll(event) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }

  getListeners(event) {
    return this.listeners[event] || [];
  }
}

export default new EventBus();
