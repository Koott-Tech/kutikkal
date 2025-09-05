"use client";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { messagesApi } from "../../../lib/backendApi";
import { useNotification } from "../../../contexts/NotificationContext";
import Messages from "../../../components/Messages";
import { 
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMessages, setShowMessages] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

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
      setConversations(conversationsData);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err.message);
      showError(`Failed to load conversations: ${err.message}`, 'Load Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationClick = (conversation) => {
    console.log('Psychologist clicked conversation:', conversation);
    setSelectedConversation(conversation);
    setShowMessages(true);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUnreadCount = (conversation) => {
    // The messages array from conversations API contains count info, not actual messages
    // We need to get the actual messages to count unread ones
    console.log('Conversation for unread count:', conversation);
    console.log('Messages array:', conversation.messages);
    
    // For now, return 0 since we don't have actual messages in the conversation list
    // The unread count should be calculated when loading individual conversation messages
    return 0;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/psychologist')}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">Client Conversations</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your conversations with clients
            </p>
          </div>

          {conversations.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600">
                You'll see conversations here when clients start messaging you.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleConversationClick(conversation)}
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {conversation.client?.first_name} {conversation.client?.last_name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Child: {conversation.client?.child_name} ({conversation.client?.child_age} years)
                        </p>
                        <p className="text-xs text-gray-500">
                          Session: {formatDate(conversation.session?.scheduled_date)} at {formatTime(conversation.session?.scheduled_time)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {formatDate(conversation.last_message_at)}
                      </p>
                      {getUnreadCount(conversation) > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                          {getUnreadCount(conversation)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages Modal */}
      {showMessages && selectedConversation && (
        <Messages 
          isOpen={showMessages} 
          onClose={() => {
            setShowMessages(false);
            setSelectedConversation(null);
            loadConversations(); // Refresh conversations
          }}
          session={selectedConversation} // Pass the conversation as session
        />
      )}
    </div>
  );
}
