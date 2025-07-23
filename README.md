# Collaborative Code Editor

This archive contains a complete MERN stack project enabling real-time collaborative coding with syntax highlighting, chat, and JWT-based auth.

## Setup

1. Extract the zip: `unzip collaborative_code_editor.zip`
2. Install backend deps:
```bash
cd collaborative_code_editor/backend
npm install
cp .env.example .env  # update values
npm run dev
```
3. Install frontend deps:
```bash
cd ../frontend
npm install
npm start
```

Backend runs on 5000, React dev server on 3000. Ensure MongoDB is running locally.
