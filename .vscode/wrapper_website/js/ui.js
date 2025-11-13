import { MODELS, getAvailableModels } from './models.js';

const messageList = document.getElementById('message-list');
const modal = document.getElementById('api-key-modal');
const modelSelect = document.getElementById('model-select');

/**
 * Securely adds a new chat message to the UI.
 * Uses textContent to prevent XSS attacks.
 * @param {string} sender - 'user' or 'ai'
 * @param {string} text - The message content
 * @param {string} modelId - The model that generated the response (optional)
 */
export function addMessage(sender, text, modelId = null) {
    if (!text || typeof text !== 'string') {
        console.error('Invalid message text:', text);
        return;
    }

    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `message-${sender}`);

    // *** CRITICAL SECURITY STEP ***
    // Use .textContent to prevent XSS vulnerabilities.
    // This renders text as plain text, not HTML.
    messageElement.textContent = text;

    // Add model tag for AI messages
    if (sender === 'ai' && modelId) {
        const modelTag = document.createElement('span');
        modelTag.classList.add('model-tag');
        modelTag.textContent = modelId;
        messageElement.appendChild(modelTag);
    }

    messageList.appendChild(messageElement);
    messageList.scrollTop = messageList.scrollHeight;
}

/**
 * Adds an error message to the chat.
 * @param {string} errorText - The error message
 */
export function addErrorMessage(errorText) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'message-error');
    messageElement.textContent = `⚠️ ${errorText}`;
    messageList.appendChild(messageElement);
    messageList.scrollTop = messageList.scrollHeight;
}

/**
 * Removes the last message from the chat.
 * Useful for removing placeholder messages.
 */
export function removeLastMessage() {
    const lastMessage = messageList.lastElementChild;
    if (lastMessage && lastMessage.classList.contains('message')) {
        lastMessage.remove();
    }
}

/**
 * Clears all messages from the chat.
 */
export function clearMessages() {
    messageList.innerHTML = '';
}

/**
 * Toggles the visibility of the API key modal.
 */
export function toggleModal() {
    modal.classList.toggle('visible');
    // Prevent body scroll when modal is open
    if (modal.classList.contains('visible')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * Closes the modal.
 */
export function closeModal() {
    if (modal.classList.contains('visible')) {
        modal.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

/**
 * Populates the model dropdown based on API key availability.
 * @param {boolean} hasApiKey - Whether the user has an API key stored
 */
export function populateModelDropdown(hasApiKey) {
    modelSelect.innerHTML = ''; // Clear existing options
    const availableModels = getAvailableModels(hasApiKey);

    if (availableModels.length === 0) {
        const option = new Option('No models available', '');
        modelSelect.add(option);
        modelSelect.disabled = true;
        return;
    }

    availableModels.forEach(model => {
        const option = new Option(model.name, model.id);
        option.title = model.description;
        modelSelect.add(option);
    });

    // Set the first model as default
    if (availableModels.length > 0) {
        const defaultModel = availableModels.find(m => m.default) || availableModels[0];
        modelSelect.value = defaultModel.id;
    }

    modelSelect.disabled = false;
}

/**
 * Gets the currently selected model ID.
 * @returns {string} - The model ID
 */
export function getSelectedModel() {
    return modelSelect.value;
}

/**
 * Sets the selected model.
 * @param {string} modelId - The model ID to select
 */
export function setSelectedModel(modelId) {
    modelSelect.value = modelId;
}

/**
 * Enables or disables the send button.
 * @param {boolean} enabled - True to enable, false to disable
 */
export function setSendButtonState(enabled) {
    const sendButton = document.getElementById('send-button');
    sendButton.disabled = !enabled;
}

/**
 * Sets the placeholder text for the prompt input.
 * @param {string} placeholder - The placeholder text
 */
export function setPromptPlaceholder(placeholder) {
    const promptInput = document.getElementById('prompt-input');
    promptInput.placeholder = placeholder;
}

/**
 * Gets the current prompt input value.
 * @returns {string} - The input value
 */
export function getPromptInput() {
    return document.getElementById('prompt-input').value.trim();
}

/**
 * Clears the prompt input.
 */
export function clearPromptInput() {
    document.getElementById('prompt-input').value = '';
}

/**
 * Sets the API key input value.
 * @param {string} value - The value to set
 */
export function setApiKeyInput(value) {
    const apiKeyInput = document.getElementById('api-key-input');
    apiKeyInput.value = value || '';
}

/**
 * Gets the API key input value.
 * @returns {string} - The API key input value
 */
export function getApiKeyInput() {
    return document.getElementById('api-key-input').value.trim();
}

/**
 * Shows a notification toast message.
 * @param {string} message - The message to show
 * @param {string} type - 'success', 'error', or 'info'
 * @param {number} duration - Duration in milliseconds
 */
export function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 0.9rem;
        z-index: 2000;
        animation: slideInRight 0.3s ease-in-out;
    `;

    const colors = {
        success: { bg: '#4CAF50', text: '#FFFFFF' },
        error: { bg: '#FF6B6B', text: '#FFFFFF' },
        info: { bg: '#2196F3', text: '#FFFFFF' }
    };

    const color = colors[type] || colors.info;
    notification.style.backgroundColor = color.bg;
    notification.style.color = color.text;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}
