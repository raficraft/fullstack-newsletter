import request from 'supertest';
import express from 'express';
import { prismaMock } from '../../../../__mocks__/prisma';
import deleteRouter from '../delete';
import { convertDatesToStrings } from '../../../../utils/utils';

const app = express();
app.use(express.json());
app.use('/newsletter/delete', deleteRouter(prismaMock));

const mockUser = {
  id: 1,
  email: 'test@test.com',
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('DELETE /newsletter/delete/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Good request', () => {
    test('should delete the user successfully', async () => {
      prismaMock.newsletter.findUnique.mockResolvedValue(mockUser);
      prismaMock.newsletter.delete.mockResolvedValue(mockUser);

      const res = await request(app).delete('/newsletter/delete/1');

      expect(res.status).toBe(200);

      convertDatesToStrings(mockUser);

      expect(res.body).toEqual(mockUser);
    });
  });

  describe('Wrong request', () => {
    test('should respond with 404 if the user is not found', async () => {
      prismaMock.newsletter.findUnique.mockResolvedValue(null);

      const res = await request(app).delete('/newsletter/delete/1');

      expect(res.status).toBe(404);
      expect(res.body).toEqual({ error: 'Email not found' });
    });

    test('should respond with 500 if something goes wrong in the database', async () => {
      prismaMock.newsletter.findUnique.mockRejectedValue(new Error());

      const res = await request(app).delete('/newsletter/delete/1');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Something went wrong' });
    });
  });
});
