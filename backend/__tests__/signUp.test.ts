import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

const prismaMock = mockDeep<PrismaClient>();

describe("Prisma User Model - findFirst()", () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Reset mocks before each test
    });

    test("should return a user when found", async () => {
        prismaMock.user.findFirst.mockResolvedValueOnce({
            id: BigInt(123),
            userId: null,
            username: "johndoe",
            password: "hashedpassword",
            name: "John Doe",
            deleted: null,
            email: "test@example.com",
            isVerified: true,
        });

        const user = await prismaMock.user.findFirst();

        expect(user).toEqual({
            id: BigInt(123),
            userId: null,
            username: "johndoe",
            password: "hashedpassword",
            name: "John Doe",
            deleted: null,
            email: "test@example.com",
            isVerified: true,
        });
    });

    test("should return null if no user is found", async () => {
        prismaMock.user.findFirst.mockResolvedValueOnce(null);

        const user = await prismaMock.user.findFirst();

        expect(user).toBeNull();
    });

    test("should return a user with isVerified false if user is unverified", async () => {
        prismaMock.user.findFirst.mockResolvedValueOnce({
            id: BigInt(456),
            userId: "u456",
            username: "unverifiedUser",
            password: "hashedpassword2",
            name: "Unverified User",
            deleted: null,
            email: "unverified@example.com",
            isVerified: false,
        });

        const user = await prismaMock.user.findFirst();

        expect(user).toEqual({
            id: BigInt(456),
            userId: "u456",
            username: "unverifiedUser",
            password: "hashedpassword2",
            name: "Unverified User",
            deleted: null,
            email: "unverified@example.com",
            isVerified: false,
        });

        expect(user?.isVerified).toBe(false);
    });

    test("should throw an error when Prisma query fails", async () => {
        prismaMock.user.findFirst.mockRejectedValueOnce(new Error("Database error"));

        await expect(prismaMock.user.findFirst()).rejects.toThrow("Database error");
    });
});
