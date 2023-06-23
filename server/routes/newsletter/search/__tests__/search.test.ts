import request from 'supertest';
import express from 'express';
import createSearchRouter from '../search'; // Assurez-vous que le chemin d'importation est correct
import { prismaMock } from '../../../../__mocks__/prisma';
import { convertDatesToStrings } from '../../../../utils/utils';

const app = express();
app.use(express.json());
const searchRouter = createSearchRouter(prismaMock);
app.use('/', searchRouter);

const mockUsers = [
  {
    id: 1,
    email: 'john@example.com',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    email: 'jane@example.com',
    active: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('GET /', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('good request', () => {
    test('should return users based on the query string', async () => {
      const queryString = 'john';
      prismaMock.newsletter.findMany.mockResolvedValue([mockUsers[0]]);

      const res = await request(app).get(`/?query=${queryString}`);

      convertDatesToStrings(mockUsers[0]);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockUsers[0]]);
    });

    test('should return empty array if no users match the query string', async () => {
      const queryString = 'notfound';
      prismaMock.newsletter.findMany.mockResolvedValue([]);

      const res = await request(app).get(`/?query=${queryString}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('bad request', () => {
    test('should handle server errors', async () => {
      const queryString = 'error';
      const unknownError = new Error('Unknown error');
      prismaMock.newsletter.findMany.mockRejectedValue(unknownError);

      const res = await request(app).get(`/?query=${queryString}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Something went wrong' });
    });

    test('should return 400 if query string is missing', async () => {
      const res = await request(app).get('/');

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Query parameter is missing' });
    });
  });
});
