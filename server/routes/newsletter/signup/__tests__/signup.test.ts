import request from 'supertest';
import express from 'express';
import createSignupRouter from '../signup';
import { prismaMock } from '../../../../__mocks__/prisma';
import { Prisma } from '@prisma/client';

const app = express();
app.use(express.json());
const signupRouter = createSignupRouter(prismaMock);
app.use('/newsletter/signup', signupRouter);

const mockUser = {
  id: 25,
  email: 'testencarton25@example.com',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUserForAssertion = {
  ...mockUser,
  createdAt: mockUser.createdAt.toISOString(),
  updatedAt: mockUser.updatedAt.toISOString(),
};

describe('POST /newsletter/signup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user', async () => {
    prismaMock.newsletter.create.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/newsletter/signup')
      .send({ email: mockUser.email });

    expect(res.status).toBe(200);

    const { createdAt, updatedAt, ...rest } = res.body;
    const formattedResBody = {
      ...rest,
      createdAt: new Date(createdAt).toISOString(),
      updatedAt: new Date(updatedAt).toISOString(),
    };

    expect(formattedResBody).toEqual(mockUserForAssertion);
  });

  it('should handle duplicate email error', async () => {
    const prismaError: any = new Error(
      'Unique constraint failed on the fields: (`email`)'
    );
    prismaError.code = 'P2002';
    prismaMock.newsletter.create.mockRejectedValue(prismaError);

    const res = await request(app)
      .post('/newsletter/signup')
      .send({ email: mockUser.email });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'This email is already in use' });
  });

  it('should handle server errors', async () => {
    const unknownError = new Error('Unknown error');

    prismaMock.newsletter.create.mockRejectedValue(unknownError);

    const res = await request(app)
      .post('/newsletter/signup')
      .send({ email: mockUser.email });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Something went wrong' });
  });

  it('should validate email', async () => {
    const res = await request(app)
      .post('/newsletter/signup')
      .send({ email: 'not an email' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Valid email is required' });
  });
});
