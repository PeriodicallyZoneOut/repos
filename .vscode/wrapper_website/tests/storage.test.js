import {
    saveApiKey,
    getApiKey,
    deleteApiKey,
    hasApiKey,
    saveSettings,
    getSettings,
    clearAllData
} from '../js/storage.js';

describe('Storage Module', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('API Key Management', () => {
        it('should save and retrieve API key', () => {
            saveApiKey('test-key-123');
            expect(getApiKey()).toBe('test-key-123');
        });

        it('should trim whitespace from API key', () => {
            saveApiKey('  test-key  ');
            expect(getApiKey()).toBe('test-key');
        });

        it('should throw error on invalid key', () => {
            expect(() => saveApiKey('')).toThrow();
            expect(() => saveApiKey(null)).toThrow();
            expect(() => saveApiKey(123)).toThrow();
        });

        it('should return null when key not found', () => {
            expect(getApiKey()).toBeNull();
        });

        it('should delete API key', () => {
            saveApiKey('test-key');
            deleteApiKey();
            expect(getApiKey()).toBeNull();
        });

        it('should check if API key exists', () => {
            expect(hasApiKey()).toBe(false);
            saveApiKey('test-key');
            expect(hasApiKey()).toBe(true);
            deleteApiKey();
            expect(hasApiKey()).toBe(false);
        });
    });

    describe('Settings Management', () => {
        it('should save and retrieve settings', () => {
            const settings = { theme: 'dark', language: 'en' };
            saveSettings(settings);
            expect(getSettings()).toEqual(settings);
        });

        it('should return empty object when no settings found', () => {
            expect(getSettings()).toEqual({});
        });
    });

    describe('Clear All Data', () => {
        it('should clear all stored data', () => {
            saveApiKey('test-key');
            saveSettings({ theme: 'dark' });
            clearAllData();
            expect(hasApiKey()).toBe(false);
            expect(getSettings()).toEqual({});
        });
    });
});
