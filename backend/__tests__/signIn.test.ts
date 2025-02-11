import  request  from 'supertest';
import { mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { app  } from "../index"
import { comparePassword } from '../utils/hashPassword';
import { generateJWT } from '../utils/auth';
const prismaMock = mockDeep<PrismaClient>();


jest.mock('../utils/hashPassword', () => ({
    comparePassword: jest.fn(),
}));

describe('POST /signin', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it('should return 200 if input validation fails', async () => {
    const response = await request(app)
      .post('/signin')
      .send({ username: 'test' }); // Missing password

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Fail');
    expect(response.body.message).toBe('ERR3');
  });

  it('should return 200 if user does not exist', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce(null); // Mock user not found

    const response = await request(app)
      .post('/signin')
      .send({ username: 'nonexistent', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Fail');
    expect(response.body.message).toBe('ERR3');
  });

  it('should return 200 if user has no password', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce({
        id: BigInt(1), 
        userId: "1", 
        username: "testuser", 
        password: 'hashedpassword', 
        name: "Test User", 
        deleted: false, 
        email: "test@example.com", 
        isVerified: true, 
      });

    const response = await request(app)
      .post('/signin')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Fail');
    expect(response.body.message).toBe('ERR3');
  });

  it('should return 200 if password is incorrect', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce({
        id: BigInt(1),
        userId: "1",
        username: "testuser",
        password: '', 
        name: "Test User",
        deleted: false,
        email: "test@example.com",
        isVerified: true,
      });

    // Mock password comparison to fail
    (comparePassword as jest.Mock).mockResolvedValueOnce(false);

    const response = await request(app)
      .post('/signin')
      .send({ username: 'testuser', password: 'wrongpassword' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Fail');
    expect(response.body.code).toBe('ERR7');
  });

  it('should return 200 and access token if credentials are valid', async () => {
    prismaMock.user.findFirst.mockResolvedValueOnce({
        id: BigInt(1),
        userId: "1",
        username: "testuser",
        password: 'hashedpassword', // Mock hashed password
        name: "Test User",
        deleted: false,
        email: "test@example.com",
        isVerified: true,
      });

    // Mock password comparison to succeed
    (comparePassword as jest.Mock).mockResolvedValueOnce(true);

    // Mock JWT generation
    (generateJWT as jest.Mock).mockReturnValueOnce('mockAccessToken');

    const response = await request(app)
      .post('/signin')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Success');
    expect(response.body.code).toBe('MSG1');
    expect(response.body.data.accessToken).toBe('mockAccessToken');
    expect(response.body.data.isVerified).toBe(true);
  });

  it('should handle unexpected errors', async () => {
    prismaMock.user.findFirst.mockRejectedValueOnce(new Error('Database error'));

    const response = await request(app)
      .post('/signin')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('Fail');
    expect(response.body.message).toBe('ERR3');
  });
});