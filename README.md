# Closh E-Commerce Platform

A fully functional mini e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js), demonstrating advanced features such as role-based authentication, bulk product uploads, and AI chatbot integration.

## Assessment Implementation Details

This project was built to satisfy the requirements of a MERN Stack Developer technical assessment.

### Core Features Implemented:
1. **User Roles & Authentication:**
   - Robust JWT-based authentication
   - Distinct roles: Admin (elevated privileges) and Customer (browsing & purchasing)
2. **Product Catalog & Management:**
   - Full CRUD operations for products
   - **Bulk Upload (Advanced Requirement):** Admins can upload CSV/Excel files containing multiple products directly in the "Manage Products" UI. The backend uses `xlsx` to parse the file and insert the products concurrently.
3. **Shopping Cart & Checkout:**
   - Customer cart management
   - Secure checkout process and order tracking
4. **AI Chatbot Integration:**
   - Integrated with Google Gemini AI (`@google/generative-ai`)
   - Customers can interact with a floating Chatbot Widget on the storefront.
   - The AI assistant has access to live product catalog and order details (contextual grounding) to answer customer queries.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB

### Environment Setup

**Backend (`backend/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key
```
*(Make sure to add the `GEMINI_API_KEY` for the AI Chatbot to function correctly.)*

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### Installation & Running

1. **Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Architecture

- **Backend:** Express.js REST API with a modular architecture (`src/modules/*`).
- **Frontend:** React with Vite, styled using Tailwind CSS and Framer Motion. Uses Axios for API calls and Zustand/Context for state management.
- **AI Integration:** Implemented in `chatbot.controller.js` and exposed via `/api/user/chatbot/message`.

## AI Service Chosen
- **Google Gemini:** Chosen for its fast response times, generous free tier, and robust SDK for Node.js. It effectively handles natural language queries contextualized with live store data.
