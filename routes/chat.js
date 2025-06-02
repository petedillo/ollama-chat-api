const express = require('express');
const router = express.Router();
const { ChatSession, Message } = require('../models');

// GET all chat sessions
router.get('/', async (req, res) => {
  try {
    const chatSessions = await ChatSession.findAll({
      order: [['createdAt', 'DESC']]
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
    const chatSession = await ChatSession.findByPk(id);
    if (!chatSession) {
      return res.status(404).json({ message: 'Chat session not found' });
    }
    
    // Save user message
    const userMessage = await Message.create({
      chatSessionId: id,
      role: role || 'user',
      content
    });
    
    // For the MVP, we're just echoing back the message as the assistant
    // In a real implementation, this would integrate with an LLM or other service
    const assistantMessage = await Message.create({
      chatSessionId: id,
      role: 'assistant',
      content: `Echo: ${content}`
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

module.exports = router;
