const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  collectCoverage: true,
  moduleDirectories: ["node_modules", "<rootDir>/"],
  moduleNameMapper: { "@/(.*)$": "<rootDir>/$1" },
  rootDir: __dirname,
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  testEnvironmentOptions: { customExportConditions: [""] },
  transform: { "^.+\\.tsx?$": "@swc/jest" },
};

module.exports = createJestConfig(customJestConfig);
