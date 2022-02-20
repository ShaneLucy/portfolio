/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.svelte$": "svelte-jester",
  },
  moduleFileExtensions: ["js", "svelte", "ts"],
  testMatch: ["**/tests/unit/**/*.[jt]s?(x)", "**/tests/integration/**/*.[jt]s?(x)"],
};
