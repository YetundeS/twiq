# TWIQ - AI Coaching Platform - Frontend

This is the **Next.js** frontend application for the AI Coaching Platform.  
Users can interact with multiple AI coaches via chat interfaces, view chat history, and manage their accounts.

---

## 🚀 Features

- Access 7 different AI coach models from the dashboard  
- Chat interface similar to ChatGPT with streaming AI responses  
- Sidebar displays recent chat sessions per AI coach  
- User authentication & session management with Supabase  
- Clean, vibrant, light-themed UI, responsive design  

---

## 📁 Project Structure

/components # React components (Chat UI, Sidebar, Auth forms, etc.)
/pages # Next.js pages (dashboard, assistant chat, login, etc.)
/lib # API helpers and utilities
/styles # Global and component-level CSS / styling
/public # Static assets (images, icons)


---

## ⚙️ Environment Variables

Create a `.env.local` file in the project root with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api    # Backend API base URL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url       # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key      # Supabase anon/public API key
```
## 🛠 Setup & Development
Clone the repository

#### 1. Install dependencies
```
npm install
# or
yarn install
```
#### 2. Start the development server:
```
npm run dev
# or
yarn dev
```

#### 3. Open http://localhost:3000 in your browser

## 📡 API Integration
- Frontend calls backend REST API for all user data and chat interactions

- Authentication handled by Supabase with JWT tokens stored in cookies or local storage

- Streaming AI responses supported through server-sent events or websockets

## 💡 Developer Notes
 1. Use /lib/api.js to add or modify API call functions

 2. Follow existing React component patterns and styling conventions

 3. The sidebar lists chat sessions grouped by AI coach — clicking loads that chat with context

 4. New chats create new sessions on the backend, old chats load existing context

 5. Communicate backend API changes early to maintain frontend compatibility

## 📖 Useful Commands

| Command | Description |
| --------------- | --------------- | 
| npm run dev    | Build production bundle    |
| npm run start    | Start production server    | 
| npm run lint    | Run linter checks    | 



# Contact
Project Maintainer: Muftau - muftau201@gmail.com
