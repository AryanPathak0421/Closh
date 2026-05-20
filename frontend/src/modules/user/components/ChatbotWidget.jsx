import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiLoader } from 'react-icons/fi';
import api from '../../../shared/utils/api';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi! I'm your Closh AI Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput("");
        
        // Add user message to UI
        const newMessages = [...messages, { id: Date.now(), text: userMsg, isBot: false }];
        setMessages(newMessages);
        setIsLoading(true);

        try {
            const response = await api.post('/user/chatbot/message', { message: userMsg });
            const botReply = response.data?.data?.reply || "Sorry, I couldn't understand that.";
            
            setMessages([...newMessages, { id: Date.now() + 1, text: botReply, isBot: true }]);
        } catch (error) {
            console.error("Chatbot Error:", error);
            setMessages([...newMessages, { 
                id: Date.now() + 1, 
                text: "I'm currently experiencing technical difficulties. Please try again later.", 
                isBot: true 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                        style={{ height: '500px', maxHeight: '80vh' }}
                    >
                        {/* Header */}
                        <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FiMessageCircle className="text-xl" />
                                <span className="font-bold">Store Assistant</span>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white transition-colors"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div 
                                        className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                                            msg.isBot 
                                            ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-sm' 
                                            : 'bg-primary-600 text-white rounded-tr-none shadow-md'
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none p-4 shadow-sm">
                                        <div className="flex gap-1.5 items-center">
                                            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form 
                            onSubmit={handleSend}
                            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
                        >
                            <input 
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                            <button 
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition-colors flex-shrink-0"
                            >
                                <FiSend />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-primary-600 text-white rounded-full shadow-xl flex items-center justify-center focus:outline-none hover:bg-primary-700 transition-colors"
            >
                {isOpen ? <FiX className="text-2xl" /> : <FiMessageCircle className="text-2xl" />}
            </motion.button>
        </div>
    );
};

export default ChatbotWidget;
