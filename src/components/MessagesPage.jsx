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
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  // Don't auto-select conversations - let user click to select
  useEffect(() => {
    // Removed auto-selection logic
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
      if (targetConversation && targetConversation.id !== selectedConversation?.id) {
        console.log('Found target conversation:', targetConversation);
        setSelectedConversation(targetConversation);
        // Show chat screen for session-specific conversations
        setShowChatScreen(true);
      }
    }
  }, [session?.conversationId, conversations, selectedConversation?.id]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Only scroll within the messages container, not the entire page
      const messagesContainer = messagesEndRef.current.parentElement;
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  };

  const loadConversations = async () => {
    // Prevent reloading if conversations are already loaded
    if (conversations.length > 0) {
      console.log('Conversations already loaded, skipping reload');
      return;
    }

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
    // Prevent loading messages for the same conversation
    if (messages.length > 0 && messages[0]?.conversation_id === conversationId) {
      console.log('Messages already loaded for conversation:', conversationId);
      return;
    }

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
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    // Don't send messages to mock conversations
    if (selectedConversation.id.startsWith('mock-') || selectedConversation.id.startsWith('fallback-')) {
      console.log('Cannot send messages to mock conversation');
      setError('Please wait for the conversation to be properly created. Try refreshing the page.');
      return;
    }

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    
    // Set sending state to prevent duplicate sends
    setIsSending(true);
    
    // Create optimistic message for immediate UI update
    const optimisticMessage = {
      id: tempId,
      content: messageContent,
      sender_type: user?.role,
      sender_id: user?.id,
      created_at: new Date().toISOString(),
      isOptimistic: true
    };

    // Clear input immediately for better UX
    setNewMessage("");
    
    // Add optimistic message to UI immediately
    setMessages(prev => [...prev, optimisticMessage]);
    
    // Update conversation in list immediately
    setConversations(prev => 
      prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, last_message_at: new Date().toISOString() }
          : conv
      )
    );

    try {
      const response = await messagesApi.sendMessage(selectedConversation.id, {
        content: messageContent,
        messageType: 'text'
      });

      console.log('Send message response:', response);

      // Extract real message data from response
      let newMessageData = null;
      if (response.success && response.message && response.message.message) {
        newMessageData = response.message.message;
      } else if (response.data && response.data.message) {
        newMessageData = response.data.message;
      } else if (response.message) {
        newMessageData = response.message;
      }

      if (newMessageData) {
        // Replace optimistic message with real message
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? { ...newMessageData, isOptimistic: false }
              : msg
          )
        );
      } else {
        // If we can't get real message, keep optimistic one but mark as sent
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? { ...msg, isOptimistic: false, status: 'sent' }
              : msg
          )
        );
        console.error('Could not extract message data from response:', response);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      
      // Restore message to input
      setNewMessage(messageContent);
      
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
    <div className="bg-white h-[calc(100vh-200px)] md:h-[calc(100vh-150px)] lg:h-[calc(100vh-120px)] flex flex-col relative">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white z-10">
        <div className="flex items-center space-x-4">
          <MessageSquare className="h-6 w-6 text-blue-600" />
          <h3>Messages</h3>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Conversations List */}
        <div className={`${showChatScreen ? 'hidden' : 'block'} w-full bg-gray-50 overflow-y-auto`}>
          <div className="p-4">
            <h4 className="text-gray-900 mb-3">Conversations</h4>
            {isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-gray-900 mb-2">No conversations yet</h3>
                <p className="text-gray-600 mb-4">Start a conversation with your booked psychologist</p>
                <button
                  onClick={() => window.location.href = '/profile/sessions'}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Sessions
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => handleConversationSelect(conversation)}
                    className={`p-5 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between space-x-6">
                      <div className="flex items-center space-x-6 flex-1 min-w-0">
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          {conversation.psychologist?.cover_image_url ? (
                            <img 
                              src={conversation.psychologist.cover_image_url}
                              alt={getConversationName(conversation)}
                              className="w-14 h-14 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-gray-900 truncate">
                            {getConversationName(conversation)}
                          </h5>
                          <p className="text-gray-500 truncate">
                            {getConversationSubtitle(conversation)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/therapist-profile?doctor=${conversation.psychologist?.id || 0}`;
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex-shrink-0"
                      >
                        Book Session
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className={`${showChatScreen ? 'block' : 'hidden'} w-full flex flex-col`}>
          {selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 border-b bg-white flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleBackToConversations}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {selectedConversation.psychologist?.cover_image_url ? (
                      <img 
                        src={selectedConversation.psychologist.cover_image_url}
                        alt={getConversationName(selectedConversation)}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-gray-900">
                      {getConversationName(selectedConversation)}
                    </h5>
                    <p className="text-gray-500">
                      {getConversationSubtitle(selectedConversation)}
                    </p>
                    <p className="text-green-600">
                      ✓ Conversation active
                    </p>
                    {selectedConversation.id.startsWith('mock-') || selectedConversation.id.startsWith('fallback-') ? (
                      <p className="text-orange-600">
                        ⚠ Temporary conversation - refresh to connect
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
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
                          } ${message?.isOptimistic ? 'opacity-70' : ''}`}
                        >
                          <p className="text-sm">{message?.content || 'Message content unavailable'}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs opacity-70">
                              {formatTime(message?.created_at)}
                            </p>
                            {message?.isOptimistic && (
                              <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
                                <span className="text-xs opacity-70">Sending...</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Fixed at bottom */}
              <div className="p-4 border-t bg-white flex-shrink-0">
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
                    disabled={!newMessage.trim() || isSending}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
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
