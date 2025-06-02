# Llama Chat API

A persistent chat API built with Express.js and PostgreSQL using Sequelize ORM.

## Setup

### Local Development

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update database credentials and other settings

3. Start the server:
   ```
   npm start
   ```
   
   For development with auto-reload:
   ```
   npm run dev
   ```

### Using Docker

1. Make sure you have Docker and Docker Compose installed on your system.

2. Build and start the containers:
   ```
   docker-compose up -d
   ```

3. To stop the containers:
   ```
   docker-compose down
   ```

4. To view logs:
   ```
   docker-compose logs -f
   ```

5. To rebuild the application after making changes:
   ```
   docker-compose up -d --build
   ```

## Database Setup

### Local Setup

1. Create PostgreSQL database:
   ```
   CREATE DATABASE llama_chat;
   ```

2. The application will automatically create tables on startup.

### Docker Setup

The database is automatically created and configured when using Docker Compose.
Data persists across container restarts using a Docker volume.

## API Endpoints

### Chat Sessions

#### GET /chat
- Returns a list of all chat sessions
- Response: Array of ChatSession objects
- Example response:
  ```json
  [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Home Automation Discussion",
      "createdAt": "2023-07-20T14:28:23.382Z",
      "updatedAt": "2023-07-20T14:28:23.382Z"
    }
  ]
  ```

#### POST /chat
- Creates a new chat session
- Request body:
  ```json
  {
    "title": "My Chat Title" // Optional, defaults to "New Chat"
  }
  ```
- Response: Created ChatSession object

#### GET /chat/:id
- Returns a specific chat session with all its messages
- URL parameter: `id` - UUID of the chat session
- Response: ChatSession object with messages array
- Example response:
  ```json
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Home Automation Discussion",
    "createdAt": "2023-07-20T14:28:23.382Z",
    "updatedAt": "2023-07-20T14:28:23.382Z",
    "messages": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "chatSessionId": "123e4567-e89b-12d3-a456-426614174000",
        "role": "user",
        "content": "Hello, how can I control my smart home?",
        "createdAt": "2023-07-20T14:28:45.382Z",
        "updatedAt": "2023-07-20T14:28:45.382Z"
      },
      {
        "id": "123e4567-e89b-12d3-a456-426614174002",
        "chatSessionId": "123e4567-e89b-12d3-a456-426614174000",
        "role": "assistant",
        "content": "I can help you control your smart home devices...",
        "createdAt": "2023-07-20T14:28:46.382Z",
        "updatedAt": "2023-07-20T14:28:46.382Z"
      }
    ]
  }
  ```

#### POST /chat/:id/message
- Sends a new message to a chat session
- URL parameter: `id` - UUID of the chat session
- Request body:
  ```json
  {
    "content": "Your message text here",
    "role": "user" // Optional, defaults to "user"
  }
  ```
- Response: Both user message and assistant response
- Example response:
  ```json
  {
    "userMessage": {
      "id": "123e4567-e89b-12d3-a456-426614174003",
      "chatSessionId": "123e4567-e89b-12d3-a456-426614174000",
      "role": "user",
      "content": "Your message text here",
      "createdAt": "2023-07-20T14:30:45.382Z",
      "updatedAt": "2023-07-20T14:30:45.382Z"
    },
    "assistantMessage": {
      "id": "123e4567-e89b-12d3-a456-426614174004",
      "chatSessionId": "123e4567-e89b-12d3-a456-426614174000",
      "role": "assistant",
      "content": "Response from assistant",
      "createdAt": "2023-07-20T14:30:46.382Z",
      "updatedAt": "2023-07-20T14:30:46.382Z"
    }
  }
  ```

## Service Integration (Future)

The backend includes a `services/` directory with placeholder implementations for various home services:

- Weather information
- Media playback
- Smart home device control

These services will be integrated with the chat functionality in future releases.

## Authentication (Optional)

JWT authentication can be implemented for multi-user support and secure remote access.

## Docker Environment Details

The Docker setup includes:

- **Express.js API**: Runs on port 3000, with hot-reloading for development
- **PostgreSQL Database**: Runs on port 5432 with persistent data storage
- **Environment Variables**: Configured via docker-compose.yml for easy setup

To access the application:
- API: http://localhost:3000
- Database: postgres://postgres:postgres@localhost:5432/llama_chat
