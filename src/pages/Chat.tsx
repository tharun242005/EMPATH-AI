import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { MessageBubble } from '../components/MessageBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { ConsentModal } from '../components/ConsentModal';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { ParticleWaves } from '../components/ParticleWaves';
import { SendButton } from '../components/SendButton';
import { EmotionParticles } from '../components/EmotionParticles';
import { MessageRipple } from '../components/MessageRipple';
import { useAuth } from '../context/AuthContext';
import { Send, AlertCircle, Phone, Menu, X, MessageSquarePlus, Settings as SettingsIcon, Scale, HelpCircle, ArrowLeft } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '../components/ui/tooltip';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { 
  getFormattedDate, 
  getDateLabel, 
  getSessions,
  saveSession,
  getSession,
  deleteSession,
  clearSessions,
  updateSessionTitle,
  type ChatMessage, 
  type ChatSession
} from '../utils/chatStorage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
  emotion?: string;
  severity?: number;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export function Chat() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('calm');
  const [showEmergency, setShowEmergency] = useState(false);
  const [showLegalHelp, setShowLegalHelp] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load a specific session
  const loadSession = (sessionId: string) => {
    try {
      const session = getSession(sessionId);
      if (session) {
        setCurrentSessionId(sessionId);
        // Convert ChatMessage[] to Message[]
        const sessionMessages = session.messages || [];
        const convertedMessages: Message[] = sessionMessages.map((msg: ChatMessage) => ({
          id: msg.id,
          text: msg.text,
          isUser: msg.isUser,
          timestamp: msg.timestamp,
          emotion: msg.emotion,
          severity: msg.severity,
        }));
        setMessages(convertedMessages);
      }
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load session');
    }
  };

  // Save current session
  const saveCurrentSession = () => {
    if (!currentSessionId || messages.length === 0) return;
    
    const session = getSession(currentSessionId);
    if (session) {
      session.messages = messages;
      saveSession(session);
      setSessions(getSessions());
    }
  };

  // Handle auto-prefill from notification click
  useEffect(() => {
    const autoMsg = searchParams.get('msg');
    const auto = searchParams.get('auto');
    
    if (auto === 'true' && autoMsg) {
      // Decode the message and prefill input
      try {
        const decodedMsg = decodeURIComponent(autoMsg);
        setInputMessage(decodedMsg);
        
        // Clear the URL params after reading
        setSearchParams({}, { replace: true });
        
        // Optionally auto-send the message after a short delay
        // Uncomment if you want automatic sending:
        // setTimeout(() => {
        //   handleSend();
        // }, 500);
      } catch (error) {
        console.error('Error decoding auto message:', error);
      }
    }
  }, [searchParams, setSearchParams]);

  // Initialize sessions and load initial session
  useEffect(() => {
    try {
      window.scrollTo(0, 0);
      
      // Check if user has consented in this session
      const sessionConsent = sessionStorage.getItem('empathai_session_consent');
      const hasConsented = localStorage.getItem('empathai_consent');
      
      if (!sessionConsent && !hasConsented && user) {
        setShowConsent(true);
      }

      // Load sessions from localStorage
      const loadedSessions = getSessions();
      setSessions(loadedSessions || []);
      
      // Load the most recent session if available, otherwise create a new one
      if (loadedSessions && loadedSessions.length > 0) {
        const latestSession = loadedSessions[0];
        if (latestSession && latestSession.id) {
          setCurrentSessionId(latestSession.id);
          // Convert ChatMessage[] to Message[] if needed
          const sessionMessages = latestSession.messages || [];
          const convertedMessages: Message[] = sessionMessages.map((msg: ChatMessage) => ({
            id: msg.id,
            text: msg.text,
            isUser: msg.isUser,
            timestamp: msg.timestamp,
            emotion: msg.emotion,
            severity: msg.severity,
          }));
          setMessages(convertedMessages.length > 0 ? convertedMessages : []);
        }
      } else {
        // No sessions exist, create a new one
        try {
          const newSessionId = crypto.randomUUID();
          const newSession: ChatSession = {
            id: newSessionId,
            title: "New Chat",
            date: getFormattedDate(),
            createdAt: Date.now(),
            messages: [],
          };
          
          saveSession(newSession);
          setSessions([newSession]);
          setCurrentSessionId(newSessionId);
          
          // Show welcome message
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            text: "Hello! I'm EmpathAI, your compassionate companion. I'm here to listen, understand, and support you. Feel free to share what's on your mind - this is a safe space. 💜",
            isUser: false,
            timestamp: new Date().toISOString(),
            emotion: 'calm',
            severity: 0,
          };
          setMessages([welcomeMessage]);
        } catch (error) {
          console.error('Error creating initial session:', error);
          // Fallback: just set empty messages
          setMessages([]);
        }
      }

      // Handle window resize for sidebar
      const handleResize = () => {
        if (window.innerWidth >= 768) {
          setSidebarOpen(true);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    } catch (error) {
      console.error('Error initializing chat:', error);
      // Fallback: set empty state
      setMessages([]);
      setSessions([]);
    }
  }, [user]);

  // Save current session whenever messages change
  useEffect(() => {
    if (currentSessionId && messages && messages.length > 0) {
      try {
        const session = getSession(currentSessionId);
        if (session) {
          // Convert Message[] to ChatMessage[] with web_enabled preserved
          const chatMessages: ChatMessage[] = messages.map(msg => {
            // Try to preserve web_enabled from existing session messages
            const existing = session.messages?.find(m => m.id === msg.id);
            return {
              id: msg.id,
              text: msg.text || '',
              isUser: msg.isUser,
              timestamp: msg.timestamp,
              emotion: msg.emotion,
              severity: msg.severity,
              web_enabled: existing?.web_enabled || false,
            };
          });
          
          session.messages = chatMessages;
          saveSession(session);
          setSessions(getSessions());
          
          // Update session title from first user message
          const firstUserMessage = messages.find(m => m.isUser);
          if (firstUserMessage && firstUserMessage.text) {
            const title = firstUserMessage.text.slice(0, 50);
            updateSessionTitle(currentSessionId, title);
            setSessions(getSessions());
          }
        }
      } catch (error) {
        console.error('Error saving session:', error);
      }
    }
  }, [messages, currentSessionId]);

  // Auto-scroll messages container
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Emotion-based background gradient
  const emotionGradients: Record<string, string> = {
    happy: 'from-green-50 via-blue-50 to-purple-50',
    sad: 'from-blue-100 via-indigo-50 to-purple-50',
    angry: 'from-red-50 via-orange-50 to-yellow-50',
    fearful: 'from-orange-50 via-yellow-50 to-red-50',
    anxious: 'from-yellow-50 via-orange-50 to-red-50',
    hopeful: 'from-green-50 via-teal-50 to-blue-50',
    calm: 'from-purple-50 via-blue-50 to-pink-50',
    distressed: 'from-red-100 via-pink-100 to-purple-100',
    neutral: 'from-gray-50 via-slate-50 to-zinc-50',
  };

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setIsTyping(true);
    setRippleTrigger(prev => prev + 1); // Trigger ripple effect

    try {
      // Send message to FastAPI backend
      // Detect if web search might be needed
      const webKeywords = ["today", "latest", "who won", "news", "update", "recent", "current", 
                          "2024", "2025", "now", "happening", "trending", "what is", "when did"];
      const messageLower = messageToSend.toLowerCase();
      const enableWeb = webKeywords.some(keyword => messageLower.includes(keyword));

      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          user_id: currentSessionId || user?.id || 'frontend_tester',
          enable_web: enableWeb,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();

      // Update emotion for background gradient
      if (responseData.emotion) {
        setCurrentEmotion(responseData.emotion);
      }

      // Show emergency help if harassment level is High
      if (responseData.harassment_level === 'High' || responseData.harassment_detected) {
        setShowEmergency(true);
      }

      // Create AI response message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseData.reply || "I'm here to support you. Could you tell me more?",
        isUser: false,
        timestamp: new Date().toISOString(),
        emotion: responseData.emotion || 'neutral',
        severity: responseData.harassment_confidence,
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      // Immediately save both messages with web_enabled flag
      if (currentSessionId) {
        const session = getSession(currentSessionId);
        if (session) {
          // Add user message
          const userChatMsg: ChatMessage = {
            id: userMessage.id,
            text: userMessage.text,
            isUser: true,
            timestamp: userMessage.timestamp,
            emotion: userMessage.emotion,
            severity: userMessage.severity,
            web_enabled: false,
          };
          
          // Add AI message with web_enabled
          const aiChatMsg: ChatMessage = {
            id: aiMessage.id,
            text: aiMessage.text,
            isUser: false,
            timestamp: aiMessage.timestamp,
            emotion: aiMessage.emotion,
            severity: aiMessage.severity,
            web_enabled: responseData.web_enabled || false,
          };
          
          // Remove duplicates and add new messages
          session.messages = session.messages.filter(m => m.id !== userMessage.id && m.id !== aiMessage.id);
          session.messages.push(userChatMsg, aiChatMsg);
          saveSession(session);
          setSessions(getSessions());
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Show error toast
      toast.error('Sorry, something went wrong. Please try again.', {
        description: error instanceof Error ? error.message : 'Unable to connect to the server.',
      });

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, something went wrong. Please try again.",
        isUser: false,
        timestamp: new Date().toISOString(),
        emotion: 'neutral',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setInputMessage(text);
  };

  const handleNewChat = async () => {
    try {
      // Save current session before creating new one
      if (currentSessionId && messages.length > 0) {
        saveCurrentSession();
      }
      
      // Create new session
      const newSessionId = crypto.randomUUID();
      const newSession: ChatSession = {
        id: newSessionId,
        title: "New Chat",
        date: getFormattedDate(),
        createdAt: Date.now(),
        messages: [],
      };
      
      saveSession(newSession);
      const updatedSessions = getSessions();
      setSessions(updatedSessions);
      setCurrentSessionId(newSessionId);
      
      // Reset backend memory for this session
      try {
        await fetch('http://127.0.0.1:8000/api/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: newSessionId }),
        });
      } catch (error) {
        console.error('Failed to reset backend session:', error);
        // Don't block UI if backend reset fails
      }
      
      // Show welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Hello! I'm here to listen and support you. What's on your mind?",
        isUser: false,
        timestamp: new Date().toISOString(),
        emotion: 'calm',
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error('Failed to create new chat. Please try again.');
    }
  };

  const handleClearChats = () => {
    if (window.confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      clearSessions();
      setSessions([]);
      setMessages([]);
      setCurrentSessionId(null);
      handleNewChat();
      toast.success('Chat history cleared');
    }
  };

  // Close sidebar when clicking on empty/white space (not on interactive elements)
  const handleSidebarBackgroundClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest('button, a, input, textarea, [role="button"], [data-prevent-close]');
    if (!interactive) {
      setSidebarOpen(false);
    }
  };

  const handleConsentClose = (consented: boolean) => {
    setShowConsent(false);
    sessionStorage.setItem('empathai_session_consent', 'true');
    if (consented) {
      localStorage.setItem('empathai_consent', 'true');
    }
  };

  const lastAIMessage = messages.filter(m => !m.isUser).pop();

  // Group sessions by date label
  const groupedSessions = sessions.reduce((acc, session) => {
    const label = getDateLabel(session.date);
    if (!acc[label]) acc[label] = [];
    acc[label].push(session);
    return acc;
  }, {} as Record<string, ChatSession[]>);

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-br ${emotionGradients[currentEmotion]} transition-all duration-1000 relative overflow-hidden`}>
      <ParticleWaves />
      <EmotionParticles emotion={currentEmotion} />
      <MessageRipple trigger={rippleTrigger} />
      <ConsentModal open={showConsent} onClose={handleConsentClose} />

      {/* Emergency Help Alert */}
      <AnimatePresence>
        {showEmergency && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
          >
            <div className="glass-card bg-red-50/95 border-2 border-red-400 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 mb-1">We're Concerned About You</h3>
                  <p className="text-sm text-red-800 mb-4">
                    If you're in crisis, please reach out to a professional immediately.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <Phone className="w-4 h-4 mr-2" />
                      Call 988
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setShowEmergency(false)}>
                      I'm Okay
                    </Button>
                  </div>
                </div>
                <button onClick={() => setShowEmergency(false)} className="text-red-600 hover:text-red-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legal Help Modal */}
      <Dialog open={showLegalHelp} onOpenChange={setShowLegalHelp}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#4B3F72]" />
              Legal Help & Resources
            </DialogTitle>
            <DialogDescription>
              Access legal information and support resources
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold mb-2">Emergency Helplines</h4>
              <div className="space-y-2 text-sm">
                <p>• National Women Helpline: <strong>1091</strong></p>
                <p>• Cyber Crime Helpline: <strong>1930</strong></p>
                <p>• Police Emergency: <strong>100</strong></p>
              </div>
            </div>
            <Link to="/legal">
              <Button className="w-full bg-[#4B3F72] hover:bg-[#6C4B8C]">
                View All Legal Resources
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      <div className="flex h-full overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed md:relative z-40 w-72 h-full glass-card border-r bg-white/90"
            >
              <div className="p-6 space-y-6 h-full flex flex-col overflow-hidden" onClick={handleSidebarBackgroundClick}>
                <Button 
                  className="w-full justify-start gap-3 bg-gradient-to-r from-[#4B3F72] to-[#6C4B8C] hover:opacity-90 shadow-lg"
                  onClick={handleNewChat}
                >
                  <MessageSquarePlus className="w-5 h-5" />
                  New Chat
                </Button>

                <div className="space-y-2">
                  <Link to="/legal" onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-[#4B3F72]/10">
                      <Scale className="w-5 h-5" />
                      Legal Resources
                    </Button>
                  </Link>
                  <Link to="/settings" onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start gap-3 hover:bg-[#4B3F72]/10">
                      <SettingsIcon className="w-5 h-5" />
                      Settings
                    </Button>
                  </Link>
                </div>

                <div className="flex-1 pt-6 border-t overflow-y-auto">
                  <div className="flex items-center justify-between mb-3 px-2">
                    <h3 className="text-xs font-semibold text-gray-500">Chat History</h3>
                    {sessions.length > 0 && (
                      <button
                        onClick={handleClearChats}
                        className="text-xs text-red-500 hover:text-red-700"
                        title="Clear all chats"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <div className="space-y-4">
                    {sessions.length === 0 ? (
                      <p className="text-xs text-gray-400 px-2">No chat history yet</p>
                    ) : (
                      Object.entries(groupedSessions).map(([label, sessionList]) => (
                        <div key={label}>
                          <h4 className="text-xs text-gray-400 mb-2 px-2">{label}</h4>
                          <div className="space-y-1">
                            {sessionList.map((session) => (
                              <Button
                                key={session.id}
                                variant="ghost"
                                size="sm"
                                className={`w-full justify-start text-xs text-left hover:bg-[#4B3F72]/10 truncate ${
                                  currentSessionId === session.id ? 'bg-[#4B3F72]/20' : ''
                                }`}
                                onClick={() => loadSession(session.id)}
                              >
                                💜 {session.title} ({session.messages.length})
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t text-xs text-gray-500 space-y-1">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Your messages are private
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full relative overflow-hidden">
          {/* Header */}
          <div className="glass-card border-b p-3 flex items-center justify-between z-10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hover:bg-[#4B3F72]/10"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <h1 className="font-semibold">EmpathAI Chat</h1>
            </div>
            <Link to="/">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Exit Chat</span>
              </Button>
            </Link>
          </div>

          {/* Messages */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
          >
            {messages && messages.length > 0 ? (
              messages.map((message) => {
                // Get web_enabled from session if available
                try {
                  const session = currentSessionId ? getSession(currentSessionId) : null;
                  const chatMessage = session?.messages?.find(m => m.id === message.id);
                  const webEnabled = chatMessage?.web_enabled || false;
                  
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message.text || ''}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                      emotion={!message.isUser ? message.emotion : undefined}
                      webEnabled={webEnabled}
                    />
                  );
                } catch (error) {
                  console.error('Error rendering message:', error);
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message.text || ''}
                      isUser={message.isUser}
                      timestamp={message.timestamp}
                    />
                  );
                }
              })
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>No messages yet. Start a conversation!</p>
              </div>
            )}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card border-t p-4 md:p-6 z-10 flex-shrink-0"
          >
            <div className="flex gap-3 items-end">
              <motion.div 
                className="flex-1"
                whileFocus={{ scale: 1.01 }}
              >
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Share what's on your mind..."
                  className="min-h-[60px] resize-none rounded-2xl glass-card border-gray-300 focus:border-[#4B3F72] transition-all duration-300"
                  rows={2}
                />
              </motion.div>
              <div className="flex flex-col gap-2">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <VoiceAssistant 
                    onTranscript={handleVoiceTranscript}
                    autoSpeak={true}
                    lastMessage={lastAIMessage?.text}
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    onClick={handleSend}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-[#4B3F72] to-[#6C4B8C] hover:opacity-90 px-6 h-12 rounded-full shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                  >
                    <motion.div
                      animate={{
                        rotate: isTyping ? 360 : 0,
                      }}
                      transition={{
                        duration: 1,
                        repeat: isTyping ? Infinity : 0,
                        ease: "linear",
                      }}
                    >
                      <Send className="w-5 h-5" />
                    </motion.div>
                    
                    {/* Animated background shine */}
                    {!isTyping && (
                      <motion.div
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Help Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLegalHelp(true)}
            style={{ position: 'fixed', bottom: '4px', right: '4px' }}
            className={`w-10 h-10 rounded-full bg-gradient-to-r from-[#4B3F72] to-[#C27691] text-white shadow-lg flex items-center justify-center z-40 ${
              currentEmotion === 'distressed' || currentEmotion === 'fearful' ? 'animate-pulse-glow' : ''
            }`}
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Legal Help & Resources</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}