# Closh E-Commerce Platform

A fully functional, scalable mini e-commerce application built with the MERN stack. This platform demonstrates robust role-based authentication, bulk product management, secure checkouts, and an intelligent AI chatbot assistant.

## Project Overview & Features

This project was developed as a comprehensive MERN stack assessment to evaluate architectural scalability, secure authentication, API integration, and AI implementation.

### Features Implemented:
1. **User Roles & Authentication (JWT-based)**
   - **Admin Role:** Secure access to an elevated dashboard, full CRUD capabilities for the product catalog, and comprehensive order management.
   - **Customer Role:** Self-registration, shopping cart management, seamless checkout process, and order history tracking.
2. **Customer Storefront**
   - Clean and responsive product catalog.
   - Product details view and add-to-cart functionality.
   - Fully responsive design for desktop and mobile devices.
3. **Admin Dashboard & Bulk Operations**
   - Tabular view of all products with actions.
   - **Bulk Upload:** Administrators can upload multiple products via CSV/Excel (.xlsx). The system parses the file, validates entries, inserts valid records into the database, and gracefully reports row-specific success/failure messages.
   - Comprehensive customer order viewing.
4. **Shopping Cart & Checkout**
   - Real-time cart management (add, remove, adjust quantities, running totals) persisted securely.
   - Complete checkout flow collecting shipping details and simulating secure payment/order confirmation.
5. **AI-Powered Store Assistant**
   - An intelligent chatbot floating widget that queries the live MongoDB database using NLP.
   - Handles product availability, price inquiries, and general store policies without fabricating information.
   - Enforces fallback states, loading indicators, and graceful error handling.

## Technology Stack

- **Frontend:** React.js (Vite), Zustand (State Management), Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcryptjs
- **AI Service Chosen:** **Google Gemini API** (`@google/generative-ai`). Chosen for its generous free tier, speed, and robust Node.js SDK, enabling accurate natural language parsing and context-aware responses grounded in the store's database.

## Complete Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local installation or MongoDB Atlas)
- A [Google Gemini API Key](https://ai.google.dev/)

### Step-by-Step Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AryanPathak0421/Closh.git
   cd Closh
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory (refer to the Environment Variables section below).

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory (refer to the Environment Variables section below).

## Environment Variables

### Backend (`backend/.env`)
Create a `.env` file in the `backend` folder with the following keys:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection
MONGO_URI=your_mongodb_connection_string

# Authentication Secrets
JWT_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=7d

# Google Gemini AI (Required for Chatbot)
GEMINI_API_KEY=your_google_gemini_api_key

# Cloudinary (For Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# OTP / Email configuration (Optional/Sandbox)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_NAME=Closh Store
FROM_EMAIL=your_email@gmail.com
```

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` folder:
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_IMAGE_BASE_URL=http://localhost:5000
```

## Running the Application

To run the application locally, you need two terminal windows.

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
The frontend will typically be accessible at `http://localhost:5173`.

## Test Credentials

Use the following credentials to access the different panels:

**Admin Dashboard:**
- Email: `admin@closh.com`
- Password: `admin123`

**Vendor Panel:**
- Email: `vendor@vendor.com`
- Password: `vendor123`

**Delivery Partner:**
- Phone: `7894561230`
- OTP (Password): `123456`

**Customer (User Panel):**
- Phone / Email: `1234567890`
- OTP (Password): `123456`

## Assumptions & Design Decisions

- **Shopping Cart Persistence:** The shopping cart state is managed locally via `Zustand` with `localStorage` persistence (`cart-storage`). This decision minimizes backend latency during the shopping experience and reduces unnecessary database writes for abandoned carts. Cart data is only finalized in the database upon checkout.
- **AI Chatbot Grounding:** The Gemini API is implemented securely on the backend. When a user asks a question, the backend retrieves product context from MongoDB *first*, then feeds that context to Gemini as a system prompt. This ensures the AI never hallucinates products that don't exist.
- **Bulk Upload Partial Failures:** During Excel/CSV uploads, the backend iterates through rows and attempts insertion. If a row fails validation (e.g., missing price), it skips the row but tracks the error, continuing to process valid rows. A detailed success/failure report is returned to the admin.
- **Authentication Fallback:** Customers can log in using either email/password or a Phone OTP flow, providing a flexible and modern authentication experience.
