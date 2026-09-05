import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }),
});
class Observer {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = Observer;
window.ResizeObserver = Observer;
window.scrollTo = () => {};
URL.createObjectURL = () => "blob:test";
URL.revokeObjectURL = () => {};
