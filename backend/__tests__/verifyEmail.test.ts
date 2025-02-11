import request from 'supertest';
import { app } from '../index'; // Import your Express app
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
describe('GET /verify-email', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it('should return HTML response on successful email verification', async () => {
    // Mock authenticated user
    const user = { id: BigInt(1), email: 'test@example.com' };

    // Mock Prisma update
    prismaMock.user.update.mockResolvedValueOnce({
      id: BigInt(1),
      userId: "1",
      username: "testuser",
      password: 'hashedpassword',
      name: "Test User",
      deleted: false,
      email: "test@example.com",
      isVerified: true, // Updated to true
    });

    const response = await request(app)
      .get('/verify-email')
      .set(
        'user',
        JSON.stringify({
          ...user,
          id: user.id.toString(), // Convert BigInt to string
        })
      );; // Simulate authenticated user

    expect(response.status).toBe(200);
    expect(response.text).toContain('Account Verified!');
    expect(response.text).toContain('Thank you for verifying your email.');
  });

  it('should return 200 if user is not authenticated', async () => {
    const response = await request(app)
      .get('/verify-email')
      .set('user', ''); // No authenticated user

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Fail');
  });

  it('should return 200 if database update fails', async () => {
    // Mock authenticated user
    const user = { id: BigInt(1), email: 'test@example.com' };

    // Mock Prisma update to fail
    prismaMock.user.update.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .get('/verify-email')
      .set('user', JSON.stringify(user)); // Simulate authenticated user

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Fail');
    expect(response.body.code).toBe('ERR2');
  });

  it('should handle unexpected errors', async () => {
    // Mock authenticated user
    const user = { id: BigInt(1), email: 'test@example.com' };

    // Mock unexpected error
    prismaMock.user.update.mockRejectedValueOnce(new Error('Unexpected error'));

    const response = await request(app)
      .get('/verify-email')
      .set('user', JSON.stringify({ ...user, id: user.id.toString() })); // Convert BigInt to string


    expect(response.status).toBe(500);
    expect(response.body.status).toBe('Fail');
    expect(response.body.code).toBe('ERR2');
  });
});