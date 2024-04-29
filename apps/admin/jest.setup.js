import "@testing-library/jest-dom";
import crypto from "crypto";
import "jest-date-mock";
import { server } from "./mocks/node";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });

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

  Object.defineProperty(window, "location", {
    configurable: true,
    enumerable: true,
    value: new URL(window.location.href),
  });

  Object.defineProperty(globalThis, "crypto", {
    value: {
      randomUUID: () => crypto.randomUUID(),
    },
  });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
