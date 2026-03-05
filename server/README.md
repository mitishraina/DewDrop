# DewDrop Server

Backend server for the DewDrop application that handles personalized recommendations using AI.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your API keys:
```env
GROQ_API=your_groq_api_key_here
PORT=3001
```

3. Start the server:
```bash
npm start
```

## API Endpoints

- `POST /api/recommendations` - Generate personalized water harvesting recommendations
- `GET /health` - Health check endpoint

## Dependencies

- Express.js for the web server
- CORS for cross-origin requests
- Python integration for AI recommendations

