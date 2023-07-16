import request from 'supertest';
import express from 'express';
import { prismaMock } from '../../../../__mocks__/prisma';
import editRouter from '../edit';
import { convertDatesToStrings } from '../../../../utils/utils';
import { Prisma } from '@prisma/client';

const app = express();
app.use(express.json());
app.use('/newsletter/edit', editRouter(prismaMock));

const mockUser = {
  id: 1,
  email: 'test@test.com',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PATCH /newsletter/edit/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Good request', () => {
    test('should update user email successfully', async () => {
      prismaMock.newsletter.update.mockResolvedValue(mockUser);

      const res = await request(app)
        .patch('/newsletter/edit/1')
        .send({ email: mockUser.email });

      expect(res.status).toBe(200);

      convertDatesToStrings(mockUser);

      expect(res.body).toEqual(mockUser);
    });
  });

  describe('Wrong request', () => {
    test('should respond with 400 if email is invalid', async () => {
      const res = await request(app)
        .patch('/newsletter/edit/1')
        .send({ email: 'invalid_email' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'Valid email is required',
      });
    });

    test('should respond with 400 if email value is missing or not a string', async () => {
      const res = await request(app).patch('/newsletter/edit/1').send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'Valid email is required',
      });

      const res2 = await request(app)
        .patch('/newsletter/edit/1')
        .send({ email: 123 });
      expect(res2.status).toBe(400);
      expect(res2.body).toEqual({
        error: 'Valid email is required',
      });
    });

    test('should respond with 500 if something goes wrong in the database', async () => {
      prismaMock.newsletter.update.mockRejectedValue(new Error());

      const res = await request(app)
        .patch('/newsletter/edit/1')
        .send({ email: mockUser.email });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Something went wrong' });
    });

    test('should respond with 400 if the email is already in use', async () => {
      const prismaError = new Error() as Prisma.PrismaClientKnownRequestError;
      prismaError['code'] = 'P2002';

      prismaMock.newsletter.update.mockRejectedValue(prismaError);

      const res = await request(app)
        .patch('/newsletter/edit/1')
        .send({ email: mockUser.email });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'This email is already in use' });
    });
  });
});
