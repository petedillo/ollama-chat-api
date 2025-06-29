const apiUrl = process.env.OLLAMA_API_URL || 'http://macpro:11434';
const defaultModel = process.env.OLLAMA_MODEL || 'llama3';

async function chat(messages) {
    try {
        const response = await fetch(`${apiUrl}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: defaultModel,
                messages: messages.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Ollama API Error: ${response.status} ${response.statusText} - ${errorData.error}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Ollama API Error:', error);
        throw new Error('Failed to get response from Ollama');
    }
}

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


module.exports = { chat, ping, generateTitle };