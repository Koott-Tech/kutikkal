"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { messagesApi } from "../../../lib/backendApi";
import { useNotification } from "../../../contexts/NotificationContext";
import { 
  Send,
  MessageSquare, 
  User, 
  Calendar,
  Clock,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PsychologistMessagesPage() {
  const { user } = useAuth();
  const { showError } = useNotification();
  const router = useRouter();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [showChatScreen, setShowChatScreen] = useState(false);
  const messagesEndRef = useRef(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    // Only load once when component first mounts
    if (!hasLoadedRef.current) {
      loadConversations();
      hasLoadedRef.current = true;
    }
  }, []);

  // Focus on input when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      // Focus on the input field after a short delay
      setTimeout(() => {
        const input = document.querySelector('input[type="text"]');
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await messagesApi.getConversations();
      console.log('Psychologist conversations response:', response);
      
      // Handle both response formats
      let conversationsData = [];
      if (response.success && response.message && response.message.conversations) {
        conversationsData = response.message.conversations;
      } else if (response.data && response.data.conversations) {
        conversationsData = response.data.conversations;
      } else if (Array.isArray(response)) {
        conversationsData = response;
      }
      
      console.log('Parsed conversations:', conversationsData);
      // Deduplicate conversations by ID to avoid double listing
      const seenIds = new Set();
      const uniqueConversations = (conversationsData || []).filter((c) => {
        const id = c?.id;
        if (!id) return true; // keep if id is missing to avoid dropping data
        if (seenIds.has(id)) return false;
        seenIds.add(id);
        return true;
      });
      setConversations(uniqueConversations);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err.message);
      showError(`Failed to load conversations: ${err.message}`, 'Load Error');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    // Prevent loading messages for the same conversation
    if (messages.length > 0 && messages[0]?.conversation_id === conversationId) {
      console.log('Messages already loaded for conversation:', conversationId);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await messagesApi.getMessages(conversationId);
      console.log('Messages API response:', response);
      
      const messagesData = response.data?.messages || response.message?.messages || [];
      console.log('Parsed messages:', messagesData);
      
      // Ensure we have valid messages
      const validMessages = messagesData.filter(message => message && message.id);
      console.log('Valid messages:', validMessages);
      
      setMessages(validMessages);
      
      // Mark messages as read (non-blocking)
      messagesApi.markAsRead(conversationId).catch(err => 
        console.error('Failed to mark messages as read:', err)
      );
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err.message);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setIsSending(true);
      const response = await messagesApi.sendMessage(selectedConversation.id, {
        content: newMessage.trim(),
        messageType: 'text'
      });

      console.log('Send message response:', response);

      // Add new message to the list - handle both response formats
      let newMessageData = null;
      if (response.success && response.message && response.message.message) {
        newMessageData = response.message.message;
      } else if (response.data && response.data.message) {
        newMessageData = response.data.message;
      } else if (response.message) {
        newMessageData = response.message;
      }

      if (newMessageData) {
        console.log('Adding new message to UI:', newMessageData);
        setMessages(prev => [...prev, newMessageData]);
        setNewMessage("");
      } else {
        console.error('Could not extract message data from response:', response);
        setError('Message sent but could not update UI. Please refresh.');
      }

      // Update conversation in list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, last_message_at: new Date().toISOString() }
            : conv
        )
      );
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    // Show chat screen when conversation is selected
    setShowChatScreen(true);
  };

  const handleBackToConversations = () => {
    // Go back to conversation list
    setShowChatScreen(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getConversationName = (conversation) => {
    return `${conversation.client?.first_name} ${conversation.client?.last_name}`;
  };

  const getConversationSubtitle = (conversation) => {
    return `Child: ${conversation.client?.child_name} (${conversation.client?.child_age} years)`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h6 className="font-semibold text-gray-900">Messages</h6>
          <p className="mt-2 text-sm text-gray-700">
            Communicate with your clients and manage conversations.
          </p>
        </div>
        {showChatScreen && (
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBackToConversations}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Conversations
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="mt-8">
        {/* Conversations List */}
        <div className={`${showChatScreen ? 'hidden' : 'block'} bg-white rounded-lg shadow-sm`}>
          <div className="p-3 sm:p-4">
            <h6 className="font-medium text-gray-900 mb-3">Conversations</h6>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No conversations yet</p>
                <p className="text-sm mt-2">You'll see conversations here when clients start messaging you.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h6 className="font-medium text-gray-900 truncate">
                          {getConversationName(conversation)}
                        </h6>
                        <p className="text-sm text-gray-500 truncate">
                          {getConversationSubtitle(conversation)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatDate(conversation.last_message_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Screen - Full Height WhatsApp Style */}
        {showChatScreen && selectedConversation && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col" style={{ height: '100vh' }}>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-3 flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
              <button
                onClick={handleBackToConversations}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h6 className="font-medium text-gray-900">
                  {getConversationName(selectedConversation)}
                </h6>
                <p className="text-sm text-gray-500">
                  Session: {formatDate(selectedConversation.session?.scheduled_date)}
                </p>
              </div>
              <div className="flex items-center text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">Active</span>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 min-h-0">
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Start a conversation</p>
                  <p className="text-sm">Type a message below to begin chatting with {getConversationName(selectedConversation)}</p>
                </div>
              ) : (
                messages
                  .filter(message => message && message.id)
                  .map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        (message?.sender_type || '') === user?.role ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          (message?.sender_type || '') === user?.role
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message?.content || 'Message content unavailable'}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {formatTime(message?.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input - Fixed at Bottom */}
            <div className="bg-white border-t border-gray-200 p-3 sm:p-4 flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={handleInputChange}
                  placeholder={`Type a message to ${getConversationName(selectedConversation)}...`}
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
