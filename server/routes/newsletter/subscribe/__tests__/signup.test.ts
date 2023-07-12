import express from 'express';
import request from 'supertest';
import { prismaMock } from '../../../../__mocks__/prisma';
import { convertDatesToStrings } from '../../../../utils/utils';
import createSignupRouter from '../subscribe';

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

describe('POST /newsletter/signup', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Good request', () => {
    test('should register a new user', async () => {
      prismaMock.newsletter.create.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/newsletter/signup')
        .send({ email: mockUser.email });

      expect(res.status).toBe(200);

      convertDatesToStrings(mockUser);

      expect(res.body).toEqual(mockUser);
    });
  });

  describe('Wrong request', () => {
    test('should handle duplicate email error', async () => {
      prismaMock.newsletter.create.mockRejectedValue({
        code: 'P2002',
        clientVersion: '4.15.0',
        meta: { target: 'Newsletter_email_key' },
      });

      const res = await request(app)
        .post('/newsletter/signup')
        .send({ email: mockUser.email });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'This email is already in use' });
    });

    test('should handle server errors', async () => {
      const unknownError = new Error('Unknown error');

      prismaMock.newsletter.create.mockRejectedValue(unknownError);

      const res = await request(app)
        .post('/newsletter/signup')
        .send({ email: mockUser.email });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Something went wrong' });
    });

    test('should validate email', async () => {
      const res = await request(app)
        .post('/newsletter/signup')
        .send({ email: 'not an email' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Valid email is required' });
    });
  });
});
