import request from 'supertest';
import hayatApp from '../hayatApp';
import { API } from 'aws-amplify';

jest.mock('aws-amplify');

describe('Hayat B2B Corporate API', () => {
  it('should search flights', async () => {
    (API.get as jest.Mock).mockResolvedValue([{ id: 1, airline: 'Hayat Airways' }]);

    const response = await request(hayatApp)
      .get('/api/hayat/b2b/corporate/search')
      .query({ from: 'NYC', to: 'LAX' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, airline: 'Hayat Airways' }]);
  });

  it('should book flights in bulk', async () => {
    (API.post as jest.Mock).mockResolvedValue({ success: true, bookingIds: [1, 2, 3] });

    const response = await request(hayatApp)
      .post('/api/hayat/b2b/corporate/bulk-book')
      .send({ flights: [{ id: 1 }, { id: 2 }, { id: 3 }] });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, bookingIds: [1, 2, 3] });
  });
});
