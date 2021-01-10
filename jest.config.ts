import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    roots: [
      "<rootDir>/src"
    ],
    testMatch: [
      "**/__tests__/**/*.+(ts|tsx|js)",
      "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest"
    },
    setupFiles: [
        "./jest.setup.ts"
    ],
    verbose: true,
  }
}
