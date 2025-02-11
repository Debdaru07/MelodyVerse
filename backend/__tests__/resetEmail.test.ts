import request from 'supertest';
import { app } from '../index'; // Import your Express app
import { generateSecurePassword } from '../utils/generatePassword';
import { hashPassword } from '../utils/hashPassword';
import { sendResetPasswordEmail } from '../utils/sendResetPasswordEmail';

import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

let server: any;

beforeAll(() => {
    server = app.listen(3000); // Start the server before running tests
});

afterAll(() => {
    server.close(); // Close the server after all tests finish
});

const prismaMock = mockDeep<PrismaClient>();

jest.mock('../utils/sendResetPasswordEmail', () => ({
    sendResetPasswordEmail: jest.fn(),
}));

jest.mock("../utils/generatePassword", () => ({
    generateSecurePassword: jest.fn(),
}));

jest.mock('../utils/hashPassword', () => ({
    hashPassword: jest.fn(),
}))

describe('POST /reset-password', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it('should return 400 if input validation fails', async () => {
    const response = await request(app)
      .post('/reset-password')
      .send({}); // Missing email

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Fail');
    expect(response.body.message).toBe('ERR3');
  });

  it('should return 200 if user does not exist', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null); // Mock user not found

    const response = await request(app)
      .post('/reset-password')
      .send({ email: 'nonexistent@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Fail');
    expect(response.body.message).toBe('ERR9');
  });

  it('should reset password and send email if user exists', async () => {
    const mockUser = {
      id: BigInt(1),
      userId: "1",
      username: "testuser",
      password: 'oldhashedpassword',
      name: "Test User",
      deleted: false,
      email: "test@example.com",
      isVerified: true,
    };

    const mockPassword = 'newsecurepassword';
    const mockHashedPassword = 'newhashedpassword';

    // Mock user lookup
    prismaMock.user.findFirst.mockResolvedValueOnce(mockUser);

    // Mock password generation
    (generateSecurePassword as jest.Mock).mockReturnValueOnce(mockPassword);

    // Mock password hashing
    (hashPassword as jest.Mock).mockResolvedValueOnce(mockHashedPassword);

    // Mock database update
    prismaMock.user.update.mockResolvedValueOnce({
      ...mockUser,
      password: mockHashedPassword,
    });

    // Mock email sending
    (sendResetPasswordEmail as jest.Mock).mockResolvedValueOnce(true);

    const response = await request(app)
      .post('/reset-password')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.message).toBe('MSG2');

    // Verify mocks
    expect(generateSecurePassword).toHaveBeenCalled();
    expect(hashPassword).toHaveBeenCalledWith(mockPassword);
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { password: mockHashedPassword },
    });
    expect(sendResetPasswordEmail).toHaveBeenCalledWith(mockUser.email, mockPassword);
  });


  it('should return 404 if database update fails', async () => {
    const mockUser = {
      id: BigInt(1),
      userId: "1",
      username: "testuser",
      password: 'oldhashedpassword',
      name: "Test User",
      deleted: false,
      email: "test@example.com",
      isVerified: true,
    };

    // Mock user lookup
    prismaMock.user.findFirst.mockResolvedValueOnce(mockUser);

    // Mock database update to fail
    prismaMock.user.update.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post('/reset-password')
      .send({ email: 'test@example.com' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('ERR2');
  });
});