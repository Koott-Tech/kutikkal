"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { messagesApi } from "../lib/backendApi";
import { 
  Send, 
  MessageSquare, 
  User, 
  Calendar,
  Clock,
  ArrowLeft
} from "lucide-react";

export default function MessagesPage({ session = null }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChatScreen, setShowChatScreen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  // Auto-select conversation when conversations are loaded
  useEffect(() => {
    if (conversations.length > 0 && !selectedConversation) {
      console.log('Auto-selecting first conversation:', conversations[0]);
      setSelectedConversation(conversations[0]);
      // Don't auto-show chat screen - let user select
    }
  }, [conversations, selectedConversation]);

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

  // Auto-select conversation if session is provided
  useEffect(() => {
    if (session && session.conversationId && conversations.length > 0) {
      console.log('Looking for conversation with ID:', session.conversationId);
      console.log('Available conversations:', conversations);
      const targetConversation = conversations.find(conv => conv.id === session.conversationId);
      if (targetConversation) {
        console.log('Found target conversation:', targetConversation);
        setSelectedConversation(targetConversation);
        // Show chat screen for session-specific conversations
        setShowChatScreen(true);
      } else {
        console.log('Target conversation not found, selecting first conversation');
        // If the specific conversation is not found, select the first one
        setSelectedConversation(conversations[0]);
        // Don't auto-show chat screen
      }
    } else if (conversations.length > 0 && !selectedConversation) {
      // If no session is provided but conversations exist, select the first one
      console.log('No session provided, selecting first conversation:', conversations[0]);
      setSelectedConversation(conversations[0]);
      // Don't auto-show chat screen
    }
  }, [session, conversations, selectedConversation]);

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
      console.log('Loading conversations...');
      const response = await messagesApi.getConversations();
      console.log('Raw API response:', response);
      console.log('Response data:', response.data);
      console.log('Response message:', response.message);
      console.log('Response success:', response.success);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response));
      
      // Check different possible response structures
      let conversationsData = [];
      if (response.success && response.message && response.message.conversations) {
        conversationsData = response.message.conversations;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        conversationsData = response.data.data;
      } else if (response.data && response.data.data && response.data.data.conversations) {
        conversationsData = response.data.data.conversations;
      } else if (response.data && Array.isArray(response.data)) {
        conversationsData = response.data;
      } else if (response.data && response.data.conversations) {
        conversationsData = response.data.conversations;
      } else if (response.conversations) {
        conversationsData = response.conversations;
      } else if (Array.isArray(response)) {
        conversationsData = response;
      }
      
      console.log('Parsed conversations array:', conversationsData);
      setConversations(conversationsData);
      
      // If no conversations loaded but we have a session, create a mock conversation
      if (conversationsData.length === 0 && session) {
        console.log('No conversations found, creating mock conversation for session:', session);
        
        // If session has a conversationId, try to load that conversation first
        if (session.conversationId && !session.conversationId.startsWith('mock-')) {
          console.log('Session has conversation ID, trying to load it:', session.conversationId);
          try {
            const conversationResponse = await messagesApi.getMessages(session.conversationId);
            if (conversationResponse && conversationResponse.data) {
              // Create a real conversation object
              const realConversation = {
                id: session.conversationId,
                psychologist: {
                  first_name: session.psychologist?.first_name || 'Dr.',
                  last_name: session.psychologist?.last_name || 'Therapist'
                },
                session: {
                  scheduled_date: session.scheduled_date,
                  scheduled_time: session.scheduled_time,
                  status: session.status
                },
                last_message_at: new Date().toISOString(),
                messages: conversationResponse.data.messages || []
              };
              console.log('Created real conversation from session ID:', realConversation);
              setConversations([realConversation]);
              setSelectedConversation(realConversation);
              return;
            }
          } catch (err) {
            console.log('Failed to load conversation with ID:', session.conversationId, err);
          }
        }
        
        // Fallback to mock conversation
        const mockConversation = {
          id: session.conversationId || 'mock-conversation-id',
          psychologist: {
            first_name: session.psychologist?.first_name || 'Dr.',
            last_name: session.psychologist?.last_name || 'Therapist'
          },
          session: {
            scheduled_date: session.scheduled_date,
            scheduled_time: session.scheduled_time,
            status: session.status
          },
          last_message_at: new Date().toISOString(),
          messages: []
        };
        console.log('Created mock conversation:', mockConversation);
        setConversations([mockConversation]);
        setSelectedConversation(mockConversation);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err.message);
      
      // Fallback: create mock conversation if API fails
      if (session) {
        console.log('API failed, creating fallback conversation for session:', session);
        const fallbackConversation = {
          id: session.conversationId || 'fallback-conversation-id',
          psychologist: {
            first_name: session.psychologist?.first_name || 'Dr.',
            last_name: session.psychologist?.last_name || 'Therapist'
          },
          session: {
            scheduled_date: session.scheduled_date,
            scheduled_time: session.scheduled_time,
            status: session.status
          },
          last_message_at: new Date().toISOString(),
          messages: []
        };
        console.log('Created fallback conversation:', fallbackConversation);
        setConversations([fallbackConversation]);
        setSelectedConversation(fallbackConversation);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Don't try to load messages for mock/fallback conversations
      if (conversationId.startsWith('mock-') || conversationId.startsWith('fallback-')) {
        console.log('Skipping message load for mock conversation:', conversationId);
        setMessages([]);
        return;
      }
      
      const response = await messagesApi.getMessages(conversationId);
      console.log('Messages API response:', response);
      console.log('Messages data:', response.data?.messages || response.message?.messages);
      
      const messagesData = response.data?.messages || response.message?.messages || [];
      console.log('Parsed messages:', messagesData);
      console.log('Messages array type:', Array.isArray(messagesData));
      console.log('Messages array length:', messagesData.length);
      console.log('First message:', messagesData[0]);
      
      // Ensure we have valid messages
      const validMessages = messagesData.filter(message => message && message.id);
      console.log('Valid messages:', validMessages);
      
      setMessages(validMessages);
      
      // Mark messages as read
      await messagesApi.markAsRead(conversationId);
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

    // Don't send messages to mock conversations
    if (selectedConversation.id.startsWith('mock-') || selectedConversation.id.startsWith('fallback-')) {
      console.log('Cannot send messages to mock conversation');
      setError('Please wait for the conversation to be properly created. Try refreshing the page.');
      return;
    }

    try {
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
    if (user?.role === 'client') {
      return `${conversation.psychologist?.first_name} ${conversation.psychologist?.last_name}`;
    } else {
      return `${conversation.client?.first_name} ${conversation.client?.last_name}`;
    }
  };

  const getConversationSubtitle = (conversation) => {
    if (user?.role === 'client') {
      return `Session: ${formatDate(conversation.session?.scheduled_date)}`;
    } else {
      return `Child: ${conversation.client?.child_name} (${conversation.client?.child_age} years)`;
    }
  };

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={showChatScreen ? handleBackToConversations : null}
            className={`p-2 hover:bg-gray-100 rounded-full ${!showChatScreen ? 'invisible' : ''}`}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations List */}
        <div className={`${showChatScreen ? 'hidden md:block' : 'block'} w-full md:w-1/3 bg-gray-50`}>
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Conversations</h3>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {getConversationName(conversation)}
                        </h4>
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

        {/* Messages Area */}
        <div className={`${!showChatScreen ? 'hidden md:block' : 'block'} flex-1 flex flex-col`}>
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {getConversationName(selectedConversation)}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {getConversationSubtitle(selectedConversation)}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Conversation active
                    </p>
                    {selectedConversation.id.startsWith('mock-') || selectedConversation.id.startsWith('fallback-') ? (
                      <p className="text-xs text-orange-600 font-medium">
                        ⚠ Temporary conversation - refresh to connect
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                    .filter(message => message && message.id) // Filter out undefined/null messages
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
                              : 'bg-gray-200 text-gray-900'
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

              {/* Message Input */}
              <div className="p-4 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder={`Type a message to ${getConversationName(selectedConversation)}...`}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
