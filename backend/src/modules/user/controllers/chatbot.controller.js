import { GoogleGenerativeAI } from '@google/generative-ai';
import Product from '../../../models/Product.model.js';
import Order from '../../../models/Order.model.js';
import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

/**
 * Helper to fetch store context (Products)
 */
const getStoreContext = async (query) => {
    // If the query mentions specific terms, try to find products
    const products = await Product.find({ status: 'active', isApproved: true })
        .select('name description price salePrice category stockQuantity')
        .limit(10);
    return products;
};

/**
 * Helper to fetch user order context
 */
const getUserOrderContext = async (userId) => {
    if (!userId) return null;
    const orders = await Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate('items.product', 'name');
    return orders;
};

/**
 * @desc    Handle Chatbot message
 * @route   POST /api/user/chatbot/message
 * @access  Public (Optional Customer Auth)
 */
export const handleChatMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json(new ApiResponse(400, null, 'Message is required'));
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // Fetch context
        const products = await getStoreContext(message);
        let orderContextStr = "User is not logged in.";
        
        // Check if user is authenticated (req.user is set by authenticate middleware if token provided)
        if (req.user) {
            const orders = await getUserOrderContext(req.user._id);
            if (orders && orders.length > 0) {
                orderContextStr = `User has recent orders: ${JSON.stringify(orders)}`;
            } else {
                orderContextStr = "User has no recent orders.";
            }
        }

        const prompt = `
            You are a helpful AI Store Assistant for Closh E-commerce.
            Be polite, concise, and helpful. 
            Do NOT make up any products or information that is not in the store database provided below.
            If a user asks for a product not in the list, politely inform them it's not available.
            If a user asks about orders and they are not logged in, tell them to log in to view orders.

            Store Products in Database:
            ${JSON.stringify(products, null, 2)}
            
            User Info:
            ${orderContextStr}

            Customer Message:
            "${message}"
            
            Provide a helpful response based ONLY on the data above.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return res.status(200).json(
            new ApiResponse(200, { reply: responseText }, 'Chatbot response generated')
        );
    } catch (error) {
        console.error('Chatbot API Error:', error);
        return res.status(200).json(
            new ApiResponse(200, { reply: "I'm sorry, I'm currently experiencing technical difficulties. Please try again later or contact our support team." }, 'Fallback response')
        );
    }
});
