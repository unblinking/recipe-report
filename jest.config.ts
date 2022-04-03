import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    testMatch: ['**/__tests__/**/*.+(ts)', '**/?(*.)+(spec|test).+(ts)'],
    transform: {
      '^.+\\.(ts)$': 'ts-jest',
    },
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    coverageDirectory: 'coverage',
    collectCoverageFrom: ['packages/**/*.{ts,tsx}'],
    coveragePathIgnorePatterns: ['jest.config.ts', '/node_modules/', '/dist/', '/build/', '/test/'],
    moduleNameMapper: {
      '^@recipe-report/(.*)$': '<rootDir>/packages/$1/',
    },
  }
}
