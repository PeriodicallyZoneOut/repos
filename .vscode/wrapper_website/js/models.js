/**
 * Defines the models available in the dropdown.
 * 'apiKeyRequired' determines if the key is needed.
 * 'default' is the model used if no key is present.
 */
export const MODELS = [
    {
        name: "DeepSeek v3 (Free)",
        id: "deepseek-v3-0324",
        apiKeyRequired: false,
        default: true,
        description: "Fast, capable free model"
    },
    {
        name: "GPT-4o Mini (Free)",
        id: "gpt-4o-mini-2024-07-18",
        apiKeyRequired: false,
        default: false,
        description: "Lightweight OpenAI model"
    },
    {
        name: "GPT-4 Turbo",
        id: "gpt-4-turbo",
        apiKeyRequired: true,
        default: false,
        description: "Advanced reasoning (requires key)"
    },
    {
        name: "Claude Sonnet 4.5",
        id: "claude-sonnet-4-5",
        apiKeyRequired: true,
        default: false,
        description: "Anthropic's advanced model (requires key)"
    }
];

/**
 * Gets the default model based on API key availability.
 * @param {boolean} hasApiKey - Whether the user has an API key
 * @returns {string} - The ID of the default model
 */
export function getDefaultModel(hasApiKey) {
    if (!hasApiKey) {
        return MODELS.find(m => m.default && !m.apiKeyRequired)?.id || MODELS[0].id;
    }
    return MODELS.find(m => m.default)?.id || MODELS[0].id;
}

/**
 * Gets a model by its ID.
 * @param {string} modelId - The model ID
 * @returns {Object|undefined} - The model object or undefined
 */
export function getModelById(modelId) {
    return MODELS.find(m => m.id === modelId);
}

/**
 * Gets available models based on API key availability.
 * @param {boolean} hasApiKey - Whether the user has an API key
 * @returns {Array} - Filtered models available to the user
 */
export function getAvailableModels(hasApiKey) {
    if (!hasApiKey) {
        return MODELS.filter(m => !m.apiKeyRequired);
    }
    return MODELS;
}
