import request from 'supertest';
import express from 'express';
import createRegisteredRouter from '../registered';
import { prismaMock } from '../../../../__mocks__/prisma';
import { convertDatesToStrings } from '../../../../utils/utils';

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
  });

  describe('Bad request', () => {
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
