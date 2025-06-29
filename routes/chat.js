const express = require('express');
const router = express.Router();
const { ChatSession, Message } = require('../models');
const ollamaService = require('../services/ollama');

// GET all chat sessions
router.get('/', async (req, res) => {
  try {
    const chatSessions = await ChatSession.findAll({
      order: [['updatedAt', 'DESC']]
    });
    res.json(chatSessions);
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    res.status(500).json({ message: 'Failed to fetch chat sessions', error: error.message });
  }
});

// POST create a new chat session
router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    const newSession = await ChatSession.create({
      title: title || 'New Chat'
    });
    res.status(201).json(newSession);
  } catch (error) {
    console.error('Error creating chat session:', error);
    res.status(500).json({ message: 'Failed to create chat session', error: error.message });
  }
});

// GET a specific chat session with its messages
router.get('/:id', async (req, res) => {
  try {
    const chatSession = await ChatSession.findByPk(req.params.id, {
      include: [{
        model: Message,
        as: 'messages',
        order: [['createdAt', 'ASC']]
      }]
    });

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    res.json(chatSession);
  } catch (error) {
    console.error('Error fetching chat session:', error);
    res.status(500).json({ message: 'Failed to fetch chat session', error: error.message });
  }
});

// POST a new message to a chat session
router.post('/:id/message', async (req, res) => {
  try {
    const { id } = req.params;
    const { content, role } = req.body;

    // Validate chat session exists
    const chatSession = await ChatSession.findByPk(id, {
      include: [{
        model: Message,
        as: 'messages',
        order: [['createdAt', 'ASC']]
      }]
    });

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    // Save user message
    const userMessage = await Message.create({
      chatSessionId: id,
      role: role || 'user',
      content
    });

    // Get all messages for context
    const messages = await Message.findAll({
      where: { chatSessionId: id },
      order: [['createdAt', 'ASC']]
    });

    // Check if this is the first user message and generate a title if needed
    if (ollamaService.isFirstUserMessage(messages) && chatSession.title === 'New Chat') {
      try {
        const generatedTitle = await ollamaService.generateTitle(content);
        if (generatedTitle) {
          await chatSession.update({ title: generatedTitle });
        }
      } catch (titleError) {
        console.error('Error generating title:', titleError);
        // Continue with the chat even if title generation fails
      }
    }

    // Get response from Ollama
    const ollamaResponse = await ollamaService.chat(messages);

    // Save assistant message
    const assistantMessage = await Message.create({
      chatSessionId: id,
      role: 'assistant',
      content: ollamaResponse.message.content
    });

    // Update the chat session's updatedAt timestamp
    await chatSession.update({
      updatedAt: new Date()
    });

    res.status(201).json({
      userMessage,
      assistantMessage
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Validate chat session exists
    const chatSession = await ChatSession.findByPk(id);

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    // Update chat session
    const updatedChatSession = await chatSession.update({
      title: title || chatSession.title,
      updatedAt: new Date()
    });

    res.json(updatedChatSession);
  } catch (error) {
    console.error('Error updating chat session:', error);
    res.status(500).json({ message: 'Failed to update chat session', error: error.message });
  }
});

// DELETE a chat session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate chat session exists
    const chatSession = await ChatSession.findByPk(id);

    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }

    // Delete chat session and its messages
    await chatSession.destroy();
    res.json({ message: 'Chat session deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat session:', error);
    res.status(500).json({ message: 'Failed to delete chat session', error: error.message });
  }
});

module.exports = router;
