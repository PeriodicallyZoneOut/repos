# Project Architecture: Secure Client-Side AI Wrapper

## 1\. Overview

This document outlines the architecture for a "zero-database" static web application. The application runs entirely in the user's browser, relying on `localStorage` for API key persistence and making direct client-to-API calls to `llm7.io`.

  * **Core Principle:** Client-side rendering and logic. No backend server.
  * **Data Storage:** User's API key is stored in the browser's `localStorage`.
  * **API Communication:** Direct `fetch` calls from the browser to the `llm7.io` API.
  * **Key Features:**
      * Securely renders chat responses to prevent XSS.
      * Manages an optional API key via a modal.
      * Allows dynamic model selection via a dropdown.

## 2\. Project File Structure

A modular structure is essential for maintainability and scalability.

```
/project-root
|
|-- index.html          # Main HTML for the application structure
|-- /css
|   |-- style.css       # All visual styling and effects
|
|-- /js
    |-- app.js          # Main application file (initialization, event listeners)
    |-- api.js          # Handles all communication with the llm7.io API
    |-- storage.js      # Manages saving/loading/deleting the API key
    |-- ui.js           # Handles rendering chat messages and UI updates
    |-- models.js       # Defines the list of available models
```

## 3\. Component Deep Dive

### 3.1 `index.html` (The Structure)

This file defines all necessary UI elements.

  * **Chat Container (`#chat-container`):** The main wrapper.
  * **Message List (`#message-list`):** A `<div>` where chat messages will be dynamically added.
  * **Input Form (`#chat-form`):**
      * A `<textarea id="prompt-input">` for multi-line user input.
      * A `<button type="submit" id="send-button">` (e.g., an icon).
  * **Model Selector (`#model-select-wrapper`):**
      * A `<select id="model-select">` menu to be populated by `js/models.js`.
  * **Settings Toggle (`#settings-toggle`):** A button (e.g., a gear icon `⚙️`) to show the modal.
  * **API Key Modal (`#api-key-modal`):**
      * A `<div>` (hidden by default) that pops up.
      * An `<input type="password" id="api-key-input">` for the API key.
      * A `<button id="save-key-button">` to save the key.
      * A `<button id="clear-key-button">` to remove the key.
      * A `<p>` for the privacy note.

### 3.2 `js/models.js` (Model Definitions)

This centralizes the model list, making it easy to update.

```javascript
// js/models.js

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
        default: true // This is the default free model
    },
    {
        name: "GPT-4o Mini (Free)",
        id: "gpt-4o-mini-2024-07-18",
        apiKeyRequired: false,
        default: false
    },
    {
        name: "GPT-5 (Key Required)",
        id: "gpt-5", // Example ID, check llm7.io for the real one
        apiKeyRequired: true,
        default: false
    },
    {
        name: "Claude Sonnet 4.5 (Key Required)",
        id: "claude-sonnet-4-5", // Example ID
        apiKeyRequired: true,
        default: false
    }
];
```

### 3.3 `js/storage.js` (API Key Management)

This module handles `localStorage` interactions safely.

```javascript
// js/storage.js

const API_KEY_NAME = 'llm7_api_key';

export function saveApiKey(key) {
  localStorage.setItem(API_KEY_NAME, key);
}

export function getApiKey() {
  return localStorage.getItem(API_KEY_NAME);
}

export function deleteApiKey() {
  localStorage.removeItem(API_KEY_NAME);
}
```

### 3.4 `js/ui.js` (Secure Rendering & DOM)

This module handles all DOM manipulation.

```javascript
// js/ui.js
import { MODELS } from './models.js';

const messageList = document.getElementById('message-list');
const modal = document.getElementById('api-key-modal');
const modelSelect = document.getElementById('model-select');

/**
 * Securely adds a new chat message to the UI.
 * @param {string} sender - 'user' or 'ai'
 * @param {string} text - The message content.
 * @param {string} modelId - The model that generated the response.
 */
export function addMessage(sender, text, modelId = null) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `message-${sender}`);

  // *** CRITICAL SECURITY STEP ***
  // Use .textContent to render text. This prevents XSS.
  messageElement.textContent = text;

  // If it's an AI message, add a tag for the model used
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
 * Toggles the visibility of the API key modal.
 */
export function toggleModal() {
  modal.classList.toggle('visible');
}

/**
 * Populates the model dropdown based on key availability.
 * @param {boolean} hasApiKey - Whether the user has an API key stored.
 */
export function populateModelDropdown(hasApiKey) {
  modelSelect.innerHTML = ''; // Clear existing options
  let defaultModelId = null;

  MODELS.forEach(model => {
    if (!model.apiKeyRequired) {
      // Always show free models
      const option = new Option(model.name, model.id);
      modelSelect.add(option);
      if (model.default) defaultModelId = model.id;
    } else if (hasApiKey) {
      // Only show premium models if the user has a key
      const option = new Option(model.name, model.id);
      modelSelect.add(option);
    }
  });

  // Set the default selection
  if (defaultModelId) {
    modelSelect.value = defaultModelId;
  }
}
```

### 3.5 `js/api.js` (API Client)

This module is solely responsible for making the `fetch` call, now with a dynamic model.

```javascript
// js/api.js

const API_URL = 'https://api.llm7.io/v1/chat/completions';

/**
 * Fetches a response from the llm7.io API.
 * @param {string} userMessage - The user's prompt.
 * @param {string} apiKey - The user's API key.
 * @param {string} modelId - The model ID to use for the request.
 * @returns {Promise<string>} - A promise that resolves with the AI's text response.
 */
export async function fetchAiResponse(userMessage, apiKey, modelId) {
  
  const payload = {
    model: modelId, // The model is now dynamic
    messages: [
      { role: 'user', content: userMessage }
    ],
    stream: false
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // The API key is passed even for free models; 
        // llm7.io's "token-based" free tier still requires the free token.
        'Authorization': `Bearer ${apiKey}` 
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error (${response.status}): ${errorData.error.message}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error('Error fetching from API:', error);
    return `Error: ${error.message}`;
  }
}
```

### 3.6 `js/app.js` (Main Controller)

This file ties all modules together and manages the application state.

```javascript
// js/app.js

import * as storage from './storage.js';
import * as ui from './ui.js';
import * as api from './api.js';
import { MODELS } from './models.js';

// --- State ---
let currentApiKey = null;
let hasKey = false;

// --- DOM Element References ---
const chatForm = document.getElementById('chat-form');
const promptInput = document.getElementById('prompt-input');
const modelSelect = document.getElementById('model-select');
const settingsToggle = document.getElementById('settings-toggle');
const saveKeyButton = document.getElementById('save-key-button');
const clearKeyButton = document.getElementById('clear-key-button');
const apiKeyInput = document.getElementById('api-key-input');

// --- Main Application Logic ---

/**
 * Handles the chat form submission.
 */
async function handleChatSubmit(e) {
  e.preventDefault();
  const userMessage = promptInput.value.trim();
  const selectedModelId = modelSelect.value;
  if (userMessage.length === 0) return;

  // 1. Get the model's requirements
  const model = MODELS.find(m => m.id === selectedModelId);

  // 2. Check for API key
  if (model.apiKeyRequired && !hasKey) {
    ui.addMessage('ai', 'Error: This model requires an API key. Please set one in Settings.');
    return;
  }
  
  // Use the stored key (which could be the "free token" or a personal paid key)
  if (!currentApiKey) {
     ui.addMessage('ai', 'Error: API Key is missing. Please set one in Settings.');
     return;
  }

  // 3. Add user message and show loading state
  ui.addMessage('user', userMessage);
  promptInput.value = '';
  ui.addMessage('ai', 'Thinking...', selectedModelId);

  // 4. Fetch the response
  const aiResponse = await api.fetchAiResponse(userMessage, currentApiKey, selectedModelId);

  // 5. Remove "Thinking..." and add the real response
  const thinkingMessage = document.querySelector('.message-ai:last-child');
  if (thinkingMessage && thinkingMessage.textContent.startsWith('Thinking...')) {
    thinkingMessage.remove();
  }
  ui.addMessage('ai', aiResponse, selectedModelId);
}

/**
 * Saves the API key, updates state, and refreshes the model list.
 */
function saveKey() {
  const newKey = apiKeyInput.value.trim();
  if (newKey) {
    storage.saveApiKey(newKey);
    currentApiKey = newKey;
    hasKey = true;
    alert('API Key saved!');
    ui.populateModelDropdown(hasKey);
    ui.toggleModal();
  } else {
    alert('Please enter a valid API key.');
  }
}

/**
 * Clears the API key, updates state, and refreshes the model list.
 */
function clearKey() {
  storage.deleteApiKey();
  currentApiKey = null;
  hasKey = false;
  apiKeyInput.value = '';
  alert('API Key cleared.');
  ui.populateModelDropdown(hasKey);
  ui.toggleModal();
}

/**
 * Loads the key from storage into the modal input.
 */
function loadKeyIntoModal() {
  apiKeyInput.value = currentApiKey || '';
}

/**
 * Initializes the application on page load.
 */
function init() {
  currentApiKey = storage.getApiKey();
  hasKey = !!currentApiKey;
  
  ui.populateModelDropdown(hasKey);

  chatForm.addEventListener('submit', handleChatSubmit);
  settingsToggle.addEventListener('click', () => { // Corrected the arrow function
    loadKeyIntoModal();
    ui.toggleModal();
  });
  saveKeyButton.addEventListener('click', saveKey);
  clearKeyButton.addEventListener('click', clearKey);
}

// --- Run Application ---
document.addEventListener('DOMContentLoaded', init);
```

## 4\. Implementation & Data Flow (Step-by-Step)

1.  **Page Load (`init`):**

      * `app.js` runs `init()`.
      * `storage.getApiKey()` checks `localStorage`.
      * `hasKey` state is set (e.g., `true`).
      * `ui.populateModelDropdown(true)` is called.
      * `ui.js` clears the `<select>` and adds *all* models (free and key-required) from `models.js` because `hasKey` is true.

2.  **User Opens Settings:**

      * User clicks `#settings-toggle`.
      * `app.js` listener calls `loadKeyIntoModal()` and `ui.toggleModal()`.
      * The modal appears, and the `<input>` is pre-filled with the user's saved key.

3.  **User Clears Key:**

      * User clicks `#clear-key-button`.
      * `app.js` listener calls `clearKey()`.
      * `storage.deleteApiKey()` removes the key.
      * `hasKey` is set to `false`.
      * `ui.populateModelDropdown(false)` is called.
      * `ui.js` *re-builds* the dropdown, this time *only* adding the free models (`apiKeyRequired: false`). The paid models disappear.
      * The modal closes.

4.  **User Sends Message (with Key):**

      * User selects "Claude Sonnet 4.5" from the dropdown.
      * User types "Hello" and hits "Send."
      * `handleChatSubmit` fires.
      * It checks the model: `model.apiKeyRequired` is `true`.
      * It checks the state: `hasKey` is `true`. The check passes.
      * `ui.addMessage('user', ...)` is called.
      * `api.fetchAiResponse("Hello", "USER_API_KEY", "claude-sonnet-4-5")` is called.
      * The response is received.
      * `ui.addMessage('ai', "Hello there!", "claude-sonnet-4-5")` is called.
      * A new AI message bubble appears, and at the bottom of it, a small tag says "claude-sonnet-4-5".

