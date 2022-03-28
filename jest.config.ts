import type { Config } from '@jest/types'

export default async (): Promise<Config.InitialOptions> => {
  return {
    testMatch: ['**/__tests__/**/*.+(ts)', '**/?(*.)+(spec|test).+(ts)'],
    transform: {
      '^.+\\.(ts)$': 'ts-jest',
    },
    verbose: true,
  }
}
