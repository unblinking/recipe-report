import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    collectCoverageFrom: [
      "src/**/*.ts"
    ],
    roots: [
      "<rootDir>/src"
    ],
    testMatch: [
      "**/__tests__/**/*.+(ts)",
      "**/?(*.)+(spec|test).+(ts)"
    ],
    transform: {
      "^.+\\.(ts)$": "ts-jest"
    },
    setupFiles: [
        "./jest.setup.ts"
    ],
    verbose: true,
  }
}
