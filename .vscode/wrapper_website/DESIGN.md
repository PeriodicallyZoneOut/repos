# UI/UX Design Guide: Clean AI Wrapper

This document outlines the visual design, layout, and user experience for the AI wrapper website. The goal is a clean, modern, and responsive interface that feels professional and intuitive.

## 1\. Core Theme & Principles

  * **Aesthetic:** Minimalist Dark Mode. Uses a dark background, light text, and a single accent color (e.g., a vibrant purple or blue) for interactive elements.
  * **Layout:** Single-page application, full-screen chat.
  * **Feel:** "Soft UI" / "Neumorphic-lite." Avoids sharp, hard edges. Uses rounded corners, subtle shadows, and glowing effects.
  * **Responsiveness:** Mobile-first. The layout must work perfectly on a phone and scale up to a desktop.


## 2\. Layout Components

### 2.1. Main Page Layout

  * **`<body>`:**
      * `background-color: #121212;` (Very dark gray, not pure black).
      * `color: #E0E0E0;` (Light gray text, not pure white).
      * `font-family: 'Inter', sans-serif;` (Clean, modern font).
  * **Header (`#header`):**
      * A simple, thin bar at the top.
      * **Left:** Site Title/Logo (e.g., "AI Wrapper").
      * **Right:** Settings Button (`#settings-toggle`).
          * **Icon:** A single gear icon (`⚙️`).
          * **Effect:** On hover, it gets a faint, glowing white background.
  * **Chat History (`#message-list`):**
      * Occupies all available space between the header and the input area.
      * `padding: 20px;`
      * `overflow-y: auto;` (Scrolls vertically).
  * **Input Area (`#input-area`):**
      * A `<div>` that sticks to the bottom of the screen.
      * `padding: 15px;`
      * `background-color: #1E1E1E;` (Slightly lighter than the main background).
      * **Effect:** A subtle, blurred shadow on top to show it's "above" the chat history.

### 2.2. Chat Messages

  * **Message Bubble (General):**
      * `border-radius: 18px;` (Noticeably rounded).
      * `padding: 12px 18px;`
      * `max-width: 70%;` (So it doesn't span the whole screen).
      * **Effect (Entry):** Fades in and slides up slightly (`transform: translateY(10px); opacity: 0;` to `transform: translateY(0); opacity: 1;`).
  * **User Message (`.message-user`):**
      * `align-self: flex-end;` (Pushes to the right).
      * `background-color: #4A4A4A;` (Darker gray).
      * `color: #FFFFFF;`
  * **AI Message (`.message-ai`):**
      * `align-self: flex-start;` (Pushes to the left).
      * `background-color: #2A2A2A;` (Slightly lighter gray).
      * **Code Blocks:** If `text` contains \`\`\` code \`\`\`, it should be rendered inside a `<pre><code>` block with a dark background and a "Copy" button.
      * **Model Tag (`.model-tag`):**
          * A small, pill-shaped tag inside the bubble (at the bottom).
          * `font-size: 0.7rem;`
          * `padding: 3px 8px;`
          * `background-color: #333;`
          * `border-radius: 10px;`
          * `color: #999;`
          * This shows the user *which* model generated the response.

### 2.3. Input Area

  * **Chat Form (`#chat-form`):**
      * Uses `display: flex;` to align items in a row.
  * **Text Input (`#prompt-input`):**
      * A `<textarea>` that grows automatically with content (auto-resizing).
      * `background-color: #252525;`
      * `border: 1px solid #333;`
      * `border-radius: 12px;`
      * `padding: 14px;`
      * `flex-grow: 1;` (Takes up most of the space).
      * **Effect (Focus):** The border glows with the accent color (e.g., purple). `box-shadow: 0 0 5px 2px #A040E0;`.
  * **Model Dropdown (`#model-select`):**
      * Placed *below* the text area, on the left.
      * `background-color: transparent;`
      * `border: none;`
      * `color: #999;`
      * `font-size: 0.8rem;`
      * This is for selecting the model *before* sending.
  * **Send Button (`#send-button`):**
      * Placed to the right of the text area.
      * **Icon:** A paper plane icon (`✈️`).
      * `background-color: #A040E0;` (Vibrant accent color).
      * `border-radius: 12px;`
      * `padding: 14px;`
      * **Effect (Hover):** Gets brighter and lifts. `transform: translateY(-2px); box-shadow: 0 4px 10px #A040E0;`.

## 3\. Settings Modal (Popup)

This is the key UX for API key management.

  * **Modal Backdrop:**
      * A full-screen, semi-transparent black overlay (`background-color: rgba(0, 0, 0, 0.5);`).
      * **Effect:** Uses `backdrop-filter: blur(8px);` to blur the chat page behind it.
  * **Modal Container (`#api-key-modal`):**
      * Centered on the screen.
      * `background-color: #1E1E1E;`
      * `border-radius: 16px;`
      * `padding: 24px;`
      * `box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);`
      * **Effect (Entry):** Fades in and scales up from 95% (`transform: scale(0.95); opacity: 0;` to `transform: scale(1); opacity: 1;`).
  * **Content:**
      * **Title:** `<h2>API Key Settings</h2>`
      * **Input (`#api-key-input`):**
          * `type="password"` (hides the key).
          * Full-width, clean design, similar to the chat input.
      * **Privacy Note:** `<p style="font-size: 0.8rem; color: #999;">Your key is saved *only* in your browser's localStorage. It is never sent to our servers.</p>`
      * **Button Group:**
          * **`#save-key-button`:** Bright accent color (e.g., purple).
          * **`#clear-key-button`:** A "danger" or "ghost" button (e.g., red text, transparent background).