import type { Config } from '@jest/types'
import { pathsToModuleNameMapper } from 'ts-jest'

import { compilerOptions } from './tsconfig.json'

export default async (): Promise<Config.InitialOptions> => {
  return {
    collectCoverageFrom: ['src/**/*.ts'],
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.+(ts)', '**/?(*.)+(spec|test).+(ts)'],
    transform: {
      '^.+\\.(ts)$': 'ts-jest',
    },
    verbose: true,
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    modulePaths: ['<rootDir>/src'],
  }
}
