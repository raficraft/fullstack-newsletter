import { prismaMock } from '@mocks/prisma';
import { convertDatesToStrings } from '@utils/utils';
import express from 'express';
import request from 'supertest';
import createRegisteredRouter from '../registered';

const app = express();
app.use(express.json());
const registeredRouter = createRegisteredRouter(prismaMock);
app.use('/newsletter/registered', registeredRouter);

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
    active: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const sortOptions = [
  'idAsc',
  'idDesc',
  'emailAsc',
  'emailDesc',
  'createdAtAsc',
  'createdAtDesc',
  'updatedAtAsc',
  'updatedAtDesc',
];

convertDatesToStrings(mockUsers);

describe('GET /newsletter/registered', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Good request', () => {
    test('should return all registered users', async () => {
      prismaMock.newsletter.findMany.mockResolvedValue(mockUsers);

      const res = await request(app).get('/newsletter/registered');

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockUsers);
    });

    test('should return registered users based on the active parameter', async () => {
      prismaMock.newsletter.findMany.mockResolvedValue([mockUsers[0]]);

      const res = await request(app).get('/newsletter/registered?active=true');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockUsers[0]]);
    });

    test.each(sortOptions)(
      'should list registered users sorted by %s',
      async (sort) => {
        prismaMock.newsletter.findMany.mockResolvedValue(mockUsers);
        const res = await request(app).get(
          `/newsletter/registered?sort=${sort}`
        );
        expect(res.status).toBe(200);
        expect(res.body).toEqual(mockUsers);
      }
    );

    test('should return users sorted by email in descending order', async () => {
      const sortedUsers = [...mockUsers].sort((a, b) =>
        b.email.localeCompare(a.email)
      );
      prismaMock.newsletter.findMany.mockResolvedValue(sortedUsers);

      const res = await request(app).get(
        '/newsletter/registered?sortBy=email&order=desc'
      );

      expect(res.status).toBe(200);
      expect(res.body).toEqual(sortedUsers);
    });
  });

  describe('Bad request', () => {
    test('should return an error if the order parameter is invalid', async () => {
      const res = await request(app).get(
        '/newsletter/registered?order=invalid'
      );

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid order parameter.' });
    });
    test('should return an error if the active parameter is invalid', async () => {
      const res = await request(app).get(
        '/newsletter/registered?active=invalid'
      );

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid active parameter.' });
    });

    test('should return an error if the sort parameter is invalid', async () => {
      const res = await request(app).get(
        '/newsletter/registered?sortBy=invalid'
      );

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ error: 'Invalid sortBy parameter.' });
    });

    test('should handle server errors', async () => {
      prismaMock.newsletter.findMany.mockRejectedValue(new Error());

      const res = await request(app).get('/newsletter/registered');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ error: 'Something went wrong' });
    });
  });
});
