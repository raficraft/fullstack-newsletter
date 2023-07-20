import { prismaMock } from '@mocks/prisma';
import { convertDatesToStrings } from '@utils/utils';
import express from 'express';
import request from 'supertest';
import unsubscribeRouter from '../unsubscribe';

const app = express();
app.use(express.json());
app.use('/newsletter/unsubscribe', unsubscribeRouter(prismaMock));

const mockUser = {
  id: 1,
  email: 'test@test.com',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PATCH /newsletter/unsubscribe/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Good request', () => {
    test('should update user active status successfully', async () => {
      prismaMock.newsletter.update.mockResolvedValue(mockUser);

      const res = await request(app)
        .patch('/newsletter/unsubscribe/1')
        .send({ active: !mockUser.active });

      expect(res.status).toBe(200);

      convertDatesToStrings(mockUser);

      expect(res.body).toEqual(mockUser);
    });
  });

  describe('Wrong request', () => {
    test('should respond with 400 if active value is missing or not a boolean', async () => {
      const res = await request(app).patch('/newsletter/unsubscribe/1').send({});

      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        error: 'Invalid value for "active". Expected a boolean.',
      });

      const res2 = await request(app)
        .patch('/newsletter/unsubscribe/1')
        .send({ active: 'not a boolean' });

      expect(res2.status).toBe(400);
      expect(res2.body).toEqual({
        error: 'Invalid value for "active". Expected a boolean.',
      });
    });

    test('should respond with 500 if something goes wrong in the database', async () => {
      prismaMock.newsletter.update.mockRejectedValue(new Error());

      const res = await request(app)
        .patch('/newsletter/unsubscribe/1')
        .send({ active: mockUser.active });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Something went wrong' });
    });
  });
});
