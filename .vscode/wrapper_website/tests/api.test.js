import { fetchAiResponse, testApiConnection } from '../js/api.js';

describe('API Module', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('fetchAiResponse', () => {
        it('should throw error on invalid user message', async () => {
            await expect(fetchAiResponse('', 'key', 'model')).rejects.toThrow();
            await expect(fetchAiResponse(null, 'key', 'model')).rejects.toThrow();
        });

        it('should throw error on invalid model ID', async () => {
            await expect(fetchAiResponse('hello', 'key', '')).rejects.toThrow();
            await expect(fetchAiResponse('hello', 'key', null)).rejects.toThrow();
        });

        it('should successfully fetch response on valid input', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    choices: [{ message: { content: 'Hello there!' } }]
                })
            });

            const result = await fetchAiResponse('Hi', 'key', 'gpt-4-turbo');
            expect(result).toBe('Hello there!');
        });

        it('should handle API error responses', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: false,
                status: 401,
                json: async () => ({ error: { message: 'Unauthorized' } })
            });

            await expect(fetchAiResponse('Hi', 'invalid-key', 'gpt-4-turbo'))
                .rejects.toThrow(/API Error/);
        });

        it('should validate response structure', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({ choices: [] })
            });

            await expect(fetchAiResponse('Hi', 'key', 'gpt-4-turbo'))
                .rejects.toThrow(/No choices returned/);
        });
    });

    describe('testApiConnection', () => {
        it('should return true on successful connection', async () => {
            global.fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => ({
                    choices: [{ message: { content: 'Test response' } }]
                })
            });

            const result = await testApiConnection('valid-key');
            expect(result).toBe(true);
        });

        it('should return false on failed connection', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Network error'));

            const result = await testApiConnection('key');
            expect(result).toBe(false);
        });
    });
});
