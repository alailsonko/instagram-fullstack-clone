import { PrismaClient } from '@prisma/client'
import { MockProxy, mockDeep } from 'jest-mock-extended'

export interface Context {
  prisma: PrismaClient
}

export interface MockContext {
  prisma: MockProxy<PrismaClient>
}

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>()
  }
}
