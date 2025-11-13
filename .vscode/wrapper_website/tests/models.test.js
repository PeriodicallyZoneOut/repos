import {
    MODELS,
    getDefaultModel,
    getModelById,
    getAvailableModels
} from '../js/models.js';

describe('Models Module', () => {
    describe('MODELS array', () => {
        it('should contain required models', () => {
            expect(MODELS.length).toBeGreaterThan(0);
            const modelIds = MODELS.map(m => m.id);
            expect(modelIds).toContain('deepseek-v3-0324');
        });

        it('should have valid model structure', () => {
            MODELS.forEach(model => {
                expect(model).toHaveProperty('name');
                expect(model).toHaveProperty('id');
                expect(model).toHaveProperty('apiKeyRequired');
                expect(model).toHaveProperty('default');
                expect(typeof model.name).toBe('string');
                expect(typeof model.id).toBe('string');
                expect(typeof model.apiKeyRequired).toBe('boolean');
                expect(typeof model.default).toBe('boolean');
            });
        });
    });

    describe('getDefaultModel', () => {
        it('should return free default model without API key', () => {
            const modelId = getDefaultModel(false);
            const model = getModelById(modelId);
            expect(model.apiKeyRequired).toBe(false);
        });

        it('should return valid model ID', () => {
            const modelId = getDefaultModel(true);
            expect(getModelById(modelId)).toBeDefined();
        });
    });

    describe('getModelById', () => {
        it('should return model by ID', () => {
            const model = getModelById('deepseek-v3-0324');
            expect(model).toBeDefined();
            expect(model.id).toBe('deepseek-v3-0324');
        });

        it('should return undefined for invalid ID', () => {
            const model = getModelById('invalid-model');
            expect(model).toBeUndefined();
        });
    });

    describe('getAvailableModels', () => {
        it('should return only free models without API key', () => {
            const models = getAvailableModels(false);
            models.forEach(model => {
                expect(model.apiKeyRequired).toBe(false);
            });
        });

        it('should return all models with API key', () => {
            const models = getAvailableModels(true);
            expect(models.length).toBe(MODELS.length);
        });

        it('should not return empty array', () => {
            expect(getAvailableModels(false).length).toBeGreaterThan(0);
            expect(getAvailableModels(true).length).toBeGreaterThan(0);
        });
    });
});
