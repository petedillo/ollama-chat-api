/**
 * Base URL for the Ollama API
 * @type {string}
 * @default 'http://macpro:11434'
 */
const apiUrl = process.env.OLLAMA_API_URL || 'http://macpro:11434';

/**
 * Default model to use for chat completions
 * @type {string}
 * @default 'llama3'
 */
const defaultModel = process.env.OLLAMA_MODEL || 'llama3';

/**
 * Checks if the current message is the first user message in a conversation.
 * This is used to determine when to add system prompts or generate chat titles.
 *
 * @param {Array<Object>} messages - Array of message objects
 * @param {string} messages[].role - The role of the message sender ('user', 'assistant', 'system')
 * @param {string} messages[].content - The content of the message
 * @returns {boolean} True if this is the first user message, false otherwise
 * @example
 * const messages = [{ role: 'user', content: 'Hello' }];
 * isFirstUserMessage(messages); // Returns: true
 */
function isFirstUserMessage(messages) {
    if (!Array.isArray(messages)) return false;
    
    // Count user messages in the conversation
    const userMessageCount = messages.reduce((count, msg) => 
        msg.role === 'user' ? count + 1 : count, 0);
    
    return userMessageCount === 1;
}

/**
 * Enhanced chat function with better prompt engineering
 * @param {Array} messages - Array of message objects with role and content
 * @returns {Promise<Object>} - The AI's response
 */
/**
 * Sends a chat completion request to the Ollama API with enhanced prompt engineering.
 * Handles message formatting, system prompts, and response parsing.
 *
 * @async
 * @param {Array<Object>} messages - Array of message objects for the conversation
 * @param {string} messages[].role - The role of the message sender
 * @param {string} messages[].content - The content of the message
 * @returns {Promise<Object>} The AI's response
 * @property {Object} message - The assistant's message
 * @property {string} message.role - Always 'assistant'
 * @property {string} message.content - The generated response content
 * @throws {Error} If the API request fails or returns an invalid response
 * @example
 * const response = await chat([
 *   { role: 'user', content: 'Hello' }
 * ]);
 */
async function chat(messages) {
    try {
        // Add system prompt for new conversations
        const enhancedMessages = [...messages];
        
        // Add system prompt if this is a new conversation (first user message)
        if (isFirstUserMessage(messages)) {
            enhancedMessages.unshift({
                role: 'system',
                content: `You are a helpful, respectful, and honest AI assistant. 
                - Be concise but thorough in your responses.
                - Use markdown formatting when appropriate.
                - If you don't know something, say so instead of making up information.
                - Break down complex topics into easy-to-understand points.
                - Always respond in the same language as the user's message.`
            });
        }

        // Format messages for the Ollama API
        const formattedMessages = enhancedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
        }));

        // Log the request for debugging
        console.log('Sending to Ollama API:', JSON.stringify({
            model: defaultModel,
            messages: formattedMessages,
            stream: false,
            options: {
                temperature: 0.7,
                top_p: 0.9,
                top_k: 40,
                num_predict: 1024,
                stop: ['</s>', '\nUser:', '\n\nUser:'],
                repeat_penalty: 1.1,
                presence_penalty: 0.1,
                frequency_penalty: 0.1
            }
        }, null, 2));

        const response = await fetch(`${apiUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: defaultModel,
                messages: formattedMessages,
                stream: false,
                options: {
                    temperature: 0.7,
                    top_p: 0.9,
                    top_k: 40,
                    num_predict: 1024,
                    stop: ['</s>', '\nUser:', '\n\nUser:'],
                    repeat_penalty: 1.1,
                    presence_penalty: 0.1,
                    frequency_penalty: 0.1
                }
            }),
            timeout: 30000 // 30 second timeout
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || response.statusText || 'Unknown error';
            throw new Error(`Ollama API Error (${response.status}): ${errorMessage}`);
        }

        let responseData;
        try {
            responseData = await response.json();
            console.log('Received from Ollama API:', JSON.stringify(responseData, null, 2));
            
            // Check for different response formats
            if (responseData.message && responseData.message.content) {
                // Standard response format
                return responseData;
            } else if (responseData.choices && responseData.choices[0]?.message) {
                // OpenAI-compatible format
                return {
                    message: {
                        role: 'assistant',
                        content: responseData.choices[0].message.content
                    }
                };
            } else if (responseData.response) {
                // Direct response format
                return {
                    message: {
                        role: 'assistant',
                        content: responseData.response
                    }
                };
            } else {
                throw new Error('Unexpected response format from Ollama API');
            }
        } catch (parseError) {
            console.error('Error parsing Ollama response:', parseError);
            throw new Error('Failed to parse response from Ollama API');
        }
    } catch (error) {
        console.error('Ollama API Error:', error);
        
        // Handle specific error cases
        if (error.name === 'AbortError') {
            throw new Error('Request to Ollama API timed out');
        }
        
        // Rethrow with a more user-friendly message
        throw new Error(`Failed to get response from Ollama: ${error.message}`);
    }
}

/**
 * Generates a concise title for a chat session based on the first user message.
 * Uses the Gemma3 model for consistent and relevant title generation.
 *
 * @async
 * @param {string} message - The user's message content to generate a title from
 * @returns {Promise<string|null>} The generated title, or null if generation fails
 * @throws {Error} If the title generation request fails
 * @example
 * const title = await generateTitle('What are some good Italian restaurants?');
 * // Returns: 'Italian Restaurant Recommendations'
 */
async function generateTitle(message) {
    try {
        const response = await fetch(`${apiUrl}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gemma3',
                prompt: `Generate a short 3-4 word title for this chat message: "${message}". Return only the title, no quotes or formatting.`,
                stream: false,
                options: {
                    temperature: 0.7,
                    max_tokens: 15
                }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Title generation failed:', errorData);
            return null;
        }

        const data = await response.json();
        // Clean up the response to ensure it's just the title
        const title = data.response.trim()
            .replace(/^["']|["']$/g, '') // Remove surrounding quotes if any
            .replace(/\n/g, ' ')          // Remove newlines
            .replace(/\s+/g, ' ')         // Collapse multiple spaces
            .trim();

        return title || 'New Chat';
    } catch (error) {
        console.error('Error generating title:', error);
        return null;
    }
}

/**
 * Checks if the Ollama API is available and responsive.
 * 
 * @async
 * @returns {Promise<boolean>} True if the API is responsive, false otherwise
 * @example
 * const isAvailable = await ping();
 * if (!isAvailable) console.error('Ollama API is not available');
 */
async function ping() {
    try {
        const response = await fetch(`${apiUrl}`, { method: 'HEAD' });
        if (response.ok) {
            return true;
        } else {
            throw new Error('Ollama API is not responding with OK');
        }
    } catch (error) {
        console.error('Failed to ping Ollama:', error);
        return false;
    }
}


/**
 * @namespace ollamaService
 * @description Provides functions to interact with the Ollama API
 */
module.exports = { 
  /** @see {@link chat} */
  chat, 
  /** @see {@link ping} */
  ping, 
  /** @see {@link generateTitle} */
  generateTitle, 
  /** @see {@link isFirstUserMessage} */
  isFirstUserMessage 
};