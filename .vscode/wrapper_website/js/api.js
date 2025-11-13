const API_URL = 'https://api.llm7.io/v1/chat/completions';
const REQUEST_TIMEOUT = 60000; // 60 seconds
const MAX_RETRIES = 2;

/**
 * Request timeout handler.
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} - Promise that rejects after timeout
 */
function createTimeoutPromise(ms) {
    return new Promise((_, reject) =>
        setTimeout(() => reject(new Error(`Request timeout after ${ms}ms`)), ms)
    );
}

/**
 * Validates the API response structure.
 * @param {Object} data - The response data
 * @returns {string} - The message content
 * @throws {Error} If response is invalid
 */
function validateResponse(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format from API');
    }

    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
        throw new Error('No choices returned from API');
    }

    const message = data.choices[0]?.message?.content;
    if (!message || typeof message !== 'string') {
        throw new Error('No valid message content in response');
    }

    return message.trim();
}

/**
 * Makes a request to the LLM7.io API with retry logic.
 * @param {string} userMessage - The user's prompt
 * @param {string} apiKey - The user's API key (can be empty for free models)
 * @param {string} modelId - The model ID to use
 * @param {number} attempt - Current retry attempt
 * @returns {Promise<string>} - The AI's text response
 * @private
 */
async function fetchWithRetry(userMessage, apiKey, modelId, attempt = 0) {
    const payload = {
        model: modelId,
        messages: [
            { role: 'user', content: userMessage }
        ],
        stream: false,
        temperature: 0.7,
        max_tokens: 2000
    };

    const headers = {
        'Content-Type': 'application/json'
    };

    // Add authorization header if key is provided
    if (apiKey && apiKey.trim()) {
        headers['Authorization'] = `Bearer ${apiKey.trim()}`;
    }

    try {
        const response = await Promise.race([
            fetch(API_URL, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(REQUEST_TIMEOUT)
            }),
            createTimeoutPromise(REQUEST_TIMEOUT)
        ]);

        if (!response.ok) {
            let errorMessage = `API Error (${response.status})`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.error?.message || errorMessage;
            } catch (e) {
                const text = await response.text();
                if (text) errorMessage += `: ${text}`;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return validateResponse(data);

    } catch (error) {
        // Retry logic for network errors (not API errors)
        if (attempt < MAX_RETRIES && error.message.includes('Failed to fetch')) {
            console.warn(`Retry attempt ${attempt + 1}/${MAX_RETRIES}...`);
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            return fetchWithRetry(userMessage, apiKey, modelId, attempt + 1);
        }

        throw error;
    }
}

/**
 * Fetches a response from the llm7.io API.
 * @param {string} userMessage - The user's prompt
 * @param {string} apiKey - The user's API key
 * @param {string} modelId - The model ID to use for the request
 * @returns {Promise<string>} - A promise that resolves with the AI's text response
 */
export async function fetchAiResponse(userMessage, apiKey, modelId) {
    if (!userMessage || typeof userMessage !== 'string') {
        throw new Error('Invalid user message');
    }

    if (!modelId || typeof modelId !== 'string') {
        throw new Error('Invalid model ID');
    }

    const trimmedMessage = userMessage.trim();
    if (trimmedMessage.length === 0) {
        throw new Error('Message cannot be empty');
    }

    try {
        const response = await fetchWithRetry(trimmedMessage, apiKey || '', modelId);
        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

/**
 * Tests the API connection with a simple request.
 * @param {string} apiKey - The API key to test
 * @returns {Promise<boolean>} - True if connection is successful
 */
export async function testApiConnection(apiKey) {
    try {
        const result = await fetchAiResponse('Hi', apiKey, 'deepseek-v3-0324');
        return typeof result === 'string' && result.length > 0;
    } catch (error) {
        console.error('API connection test failed:', error);
        return false;
    }
}
