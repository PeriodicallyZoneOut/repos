const API_KEY_STORAGE_KEY = 'llm7_api_key';
const SETTINGS_STORAGE_KEY = 'llm7_settings';

/**
 * Saves the API key to localStorage.
 * @param {string} key - The API key to save
 * @throws {Error} If key is invalid or storage fails
 */
export function saveApiKey(key) {
    if (!key || typeof key !== 'string') {
        throw new Error('Invalid API key format');
    }

    try {
        localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            throw new Error('Storage quota exceeded');
        }
        throw error;
    }
}

/**
 * Retrieves the API key from localStorage.
 * @returns {string|null} - The stored API key or null
 */
export function getApiKey() {
    try {
        return localStorage.getItem(API_KEY_STORAGE_KEY);
    } catch (error) {
        console.error('Error reading API key from storage:', error);
        return null;
    }
}

/**
 * Deletes the API key from localStorage.
 * @throws {Error} If deletion fails
 */
export function deleteApiKey() {
    try {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
    } catch (error) {
        console.error('Error deleting API key:', error);
        throw error;
    }
}

/**
 * Checks if an API key is stored.
 * @returns {boolean} - True if key exists
 */
export function hasApiKey() {
    return !!getApiKey();
}

/**
 * Saves application settings.
 * @param {Object} settings - Settings object
 */
export function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

/**
 * Retrieves application settings.
 * @returns {Object} - Settings object or empty object
 */
export function getSettings() {
    try {
        const settings = localStorage.getItem(SETTINGS_STORAGE_KEY);
        return settings ? JSON.parse(settings) : {};
    } catch (error) {
        console.error('Error reading settings:', error);
        return {};
    }
}

/**
 * Clears all stored data.
 */
export function clearAllData() {
    try {
        localStorage.removeItem(API_KEY_STORAGE_KEY);
        localStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing data:', error);
    }
}
