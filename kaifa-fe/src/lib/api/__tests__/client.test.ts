import { apiClient, axiosClient } from '../client';

const mockRequest = jest.spyOn(axiosClient, 'request');

beforeEach(() => mockRequest.mockClear());

function mockSuccess(data: unknown) {
  mockRequest.mockResolvedValueOnce({ data });
}

function mockFailure(message?: string) {
  mockRequest.mockRejectedValueOnce({
    isAxiosError: true,
    response: {
      data: message ? { message } : {},
    },
  });
}

describe('apiClient', () => {
  describe('get', () => {
    it('makes GET request and returns data', async () => {
      mockSuccess({ id: 1 });
      const result = await apiClient.get('/items');
      expect(result).toEqual({ id: 1 });
      expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'GET' }));
      expect(mockRequest.mock.calls[0]?.[0].url).toContain('/items');
    });

    it('appends query params to URL', async () => {
      mockSuccess([]);
      await apiClient.get('/items', { params: { page: '2', limit: '10' } });
      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({ params: { page: '2', limit: '10' } }),
      );
    });
  });

  describe('post', () => {
    it('makes POST request with JSON body and returns data', async () => {
      const responseData = { id: 1, name: 'test' };
      mockSuccess(responseData);
      const result = await apiClient.post('/items', { name: 'test' });
      expect(result).toEqual(responseData);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: 'POST', data: { name: 'test' } }),
      );
    });
  });

  describe('put', () => {
    it('makes PUT request with JSON body and returns data', async () => {
      mockSuccess({ id: 1, name: 'updated' });
      const result = await apiClient.put('/items/1', { name: 'updated' });
      expect(result).toEqual({ id: 1, name: 'updated' });
      expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'PUT' }));
      expect(mockRequest.mock.calls[0]?.[0].url).toContain('/items/1');
    });
  });

  describe('delete', () => {
    it('makes DELETE request and returns data', async () => {
      mockSuccess({ success: true });
      const result = await apiClient.delete('/items/1');
      expect(result).toEqual({ success: true });
      expect(mockRequest).toHaveBeenCalledWith(expect.objectContaining({ method: 'DELETE' }));
      expect(mockRequest.mock.calls[0]?.[0].url).toContain('/items/1');
    });
  });

  describe('error handling', () => {
    it('throws error with message from response when not ok', async () => {
      mockFailure('Item tidak ditemukan');
      await expect(apiClient.get('/items/999')).rejects.toThrow('Item tidak ditemukan');
    });

    it('throws default error when response has no message', async () => {
      mockFailure();
      await expect(apiClient.get('/items/999')).rejects.toThrow('Request gagal');
    });

    it('throws network error when json() fails', async () => {
      mockRequest.mockRejectedValueOnce({ isAxiosError: true });
      await expect(apiClient.get('/items/999')).rejects.toThrow('Terjadi kesalahan jaringan');
    });
  });
});
