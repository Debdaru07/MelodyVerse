import { PrismaClient } from '@prisma/client';

const prismaMock = {
  user: {
    findFirst: jest.fn(),
  },
} as unknown as PrismaClient;

export default prismaMock;
