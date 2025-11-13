import * as storage from './storage.js';
import * as ui from './ui.js';
import * as api from './api.js';
import { MODELS, getModelById, getDefaultModel } from './models.js';

// ========== STATE ==========
let currentApiKey = null;
let hasApiKey = false;
let isLoading = false;
let currentModelId = null;

// ========== DOM REFERENCES ==========
const chatForm = document.getElementById('chat-form');
const promptInput = document.getElementById('prompt-input');
const modelSelect = document.getElementById('model-select');
const settingsToggle = document.getElementById('settings-toggle');
const saveKeyButton = document.getElementById('save-key-button');
const clearKeyButton = document.getElementById('clear-key-button');
const apiKeyInput = document.getElementById('api-key-input');
const modal = document.getElementById('api-key-modal');

// ========== EVENT HANDLERS ==========

/**
 * Handles the chat form submission.
 * Validates input, checks API key requirements, and fetches response.
 */
async function handleChatSubmit(e) {
    e.preventDefault();

    const userMessage = ui.getPromptInput();
    if (!userMessage) {
        ui.showNotification('Please enter a message', 'info');
        return;
    }

    const selectedModelId = ui.getSelectedModel();
    if (!selectedModelId) {
        ui.showNotification('Please select a model', 'error');
        return;
    }

    // Check model requirements
    const model = getModelById(selectedModelId);
    if (!model) {
        ui.showNotification('Invalid model selected', 'error');
        return;
    }

    // Validate API key availability
    if (model.apiKeyRequired && !hasApiKey) {
        ui.showNotification('This model requires an API key. Please set one in Settings.', 'error');
        return;
    }

    if (!currentApiKey) {
        ui.showNotification('API key is missing. Please set one in Settings.', 'error');
        return;
    }

    // Prevent duplicate submissions
    if (isLoading) {
        return;
    }

    // Update state
    isLoading = true;
    currentModelId = selectedModelId;
    ui.setSendButtonState(false);

    // Add user message
    ui.addMessage('user', userMessage);
    ui.clearPromptInput();

    // Show loading indicator
    ui.addMessage('ai', '🤖 Thinking...', selectedModelId);

    try {
        // Fetch AI response
        const aiResponse = await api.fetchAiResponse(userMessage, currentApiKey, selectedModelId);

        // Remove loading indicator
        ui.removeLastMessage();

        // Add AI response
        ui.addMessage('ai', aiResponse, selectedModelId);

    } catch (error) {
        // Remove loading indicator
        ui.removeLastMessage();

        // Handle specific error types
        let errorMessage = 'An error occurred. Please try again.';

        if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            errorMessage = 'Invalid API key. Please check your settings.';
        } else if (error.message.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'Request timed out. Please try again.';
        } else if (error.message) {
            errorMessage = error.message;
        }

        ui.addErrorMessage(errorMessage);
        console.error('Chat error:', error);

    } finally {
        isLoading = false;
        ui.setSendButtonState(true);
    }
}

/**
 * Saves the API key from the modal input.
 * Updates state and refreshes the model dropdown.
 */
function handleSaveKey() {
    const newKey = ui.getApiKeyInput();

    if (!newKey) {
        ui.showNotification('Please enter a valid API key', 'error');
        return;
    }

    try {
        storage.saveApiKey(newKey);
        currentApiKey = newKey;
        hasApiKey = true;

        ui.populateModelDropdown(hasApiKey);
        ui.closeModal();
        ui.showNotification('✅ API key saved successfully!', 'success');

    } catch (error) {
        ui.showNotification(`Error saving key: ${error.message}`, 'error');
        console.error('Save key error:', error);
    }
}

/**
 * Clears the stored API key.
 * Updates state and refreshes the model dropdown.
 */
function handleClearKey() {
    if (!confirm('Are you sure you want to clear your API key?')) {
        return;
    }

    try {
        storage.deleteApiKey();
        currentApiKey = null;
        hasApiKey = false;
        ui.setApiKeyInput('');

        ui.populateModelDropdown(hasApiKey);
        ui.closeModal();
        ui.showNotification('✅ API key cleared', 'success');

    } catch (error) {
        ui.showNotification(`Error clearing key: ${error.message}`, 'error');
        console.error('Clear key error:', error);
    }
}

/**
 * Opens the settings modal and pre-fills the API key input.
 */
function handleSettingsToggle() {
    ui.setApiKeyInput(currentApiKey || '');
    ui.toggleModal();
}

/**
 * Closes the modal when the backdrop is clicked.
 */
function handleBackdropClick(e) {
    if (e.target === modal.querySelector('.modal-backdrop')) {
        ui.closeModal();
    }
}

/**
 * Closes the modal when Escape is pressed.
 */
function handleKeyboardClose(e) {
    if (e.key === 'Escape' && modal.classList.contains('visible')) {
        ui.closeModal();
    }
}

// ========== INITIALIZATION ==========

/**
 * Initializes the application on page load.
 * Loads stored API key, populates models, and sets up event listeners.
 */
function initialize() {
    // Load stored API key
    currentApiKey = storage.getApiKey();
    hasApiKey = !!currentApiKey;

    // Populate model dropdown
    ui.populateModelDropdown(hasApiKey);
    currentModelId = ui.getSelectedModel();

    // Set up event listeners
    chatForm.addEventListener('submit', handleChatSubmit);
    settingsToggle.addEventListener('click', handleSettingsToggle);
    saveKeyButton.addEventListener('click', handleSaveKey);
    clearKeyButton.addEventListener('click', handleClearKey);

    // Modal close handlers
    modal.addEventListener('click', handleBackdropClick);
    document.addEventListener('keydown', handleKeyboardClose);

    // Auto-resize textarea
    promptInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });

    // Model selection change
    modelSelect.addEventListener('change', function () {
        currentModelId = this.value;
    });

    console.log('AI Wrapper initialized successfully');
}

// ========== RUN APPLICATION ==========
document.addEventListener('DOMContentLoaded', initialize);
