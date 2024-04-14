import "@testing-library/jest-dom";
import { server } from "./mocks/node";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });

  window.getComputedStyle = (elt) => window.getComputedStyle(elt);
  window.HTMLElement.prototype.scrollIntoView = () => {};

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
