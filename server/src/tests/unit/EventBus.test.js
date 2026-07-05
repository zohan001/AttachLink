import { describe, it, expect, vi } from "vitest";
import EventBus from "../../core/events/EventBus.js";

describe("EventBus", () => {
  beforeEach(() => {
    EventBus.removeAll();
  });

  it("on() registers a handler and returns an unsubscribe function", () => {
    const handler = vi.fn();
    const unsubscribe = EventBus.on("test:event", handler);

    expect(EventBus.getListeners("test:event")).toHaveLength(1);
    expect(typeof unsubscribe).toBe("function");
  });

  it("emit() calls all registered handlers", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    EventBus.on("test:event", handler1);
    EventBus.on("test:event", handler2);

    EventBus.emit("test:event", { key: "value" });

    expect(handler1).toHaveBeenCalledWith({ key: "value" });
    expect(handler2).toHaveBeenCalledWith({ key: "value" });
  });

  it("emit() does nothing when no handlers are registered", () => {
    expect(() => {
      EventBus.emit("nonexistent:event", {});
    }).not.toThrow();
  });

  it("emit() handles errors in handlers gracefully", () => {
    const failingHandler = vi.fn(() => {
      throw new Error("Handler error");
    });
    const passingHandler = vi.fn();

    EventBus.on("test:event", failingHandler);
    EventBus.on("test:event", passingHandler);

    expect(() => {
      EventBus.emit("test:event", {});
    }).not.toThrow();

    expect(passingHandler).toHaveBeenCalled();
  });

  it("unsubscribe removes the specific handler", () => {
    const handler = vi.fn();
    const unsubscribe = EventBus.on("test:event", handler);

    unsubscribe();
    EventBus.emit("test:event", {});

    expect(handler).not.toHaveBeenCalled();
    expect(EventBus.getListeners("test:event")).toHaveLength(0);
  });

  it("removeAll() clears all listeners for a specific event", () => {
    EventBus.on("event1", vi.fn());
    EventBus.on("event1", vi.fn());
    EventBus.on("event2", vi.fn());

    EventBus.removeAll("event1");

    expect(EventBus.getListeners("event1")).toHaveLength(0);
    expect(EventBus.getListeners("event2")).toHaveLength(1);
  });

  it("removeAll() with no argument clears all listeners", () => {
    EventBus.on("event1", vi.fn());
    EventBus.on("event2", vi.fn());

    EventBus.removeAll();

    expect(EventBus.getListeners("event1")).toHaveLength(0);
    expect(EventBus.getListeners("event2")).toHaveLength(0);
  });

  it("getListeners() returns empty array for unknown event", () => {
    expect(EventBus.getListeners("unknown")).toEqual([]);
  });
});
