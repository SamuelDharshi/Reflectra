import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Bot, User, Loader2, Sparkles, AlertCircle, Wifi, WifiOff, Zap } from 'lucide-react'
import { Mic } from 'lucide-react'
import { AIVoiceInput } from './AIVoiceInput'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { claudeAPI } from '../utils/apiClient'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  isError?: boolean
  isFallback?: boolean
  provider?: string
}

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm your AI reflection assistant. I can help you explore your thoughts, discuss your reflections, and provide guidance based on your personal journey. What would you like to talk about?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userReflections, setUserReflections] = useState<any[]>([])
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'offline' | 'checking' | 'fallback'>('checking')
  const [connectionMethod, setConnectionMethod] = useState<string>('')
  const [showVoice, setShowVoice] = useState(false)
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null)
  const recordedChunksRef = React.useRef<Blob[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (isOpen && user) {
      fetchUserReflections()
    } else if (isOpen && !user) {
      // For non-authenticated users, load from localStorage
      const savedReflections = JSON.parse(localStorage.getItem('reflectraReflections') || '[]')
      setUserReflections(savedReflections.slice(0, 3)) // Limit to recent 3
    }
    
    // Check API connection when chat opens
    if (isOpen) {
      checkAPIConnection()
    }
  }, [isOpen, user])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkAPIConnection = async () => {
    setConnectionStatus('checking')
    try {
      const health = await claudeAPI.checkAPIHealth()
      if (health.healthy) {
        setConnectionStatus('connected')
        setConnectionMethod(health.method || 'unknown')
        console.log(`AI API connected via ${health.method}`)
      } else {
        setConnectionStatus('offline')
        setConnectionMethod('')
      }
    } catch (error) {
      console.error('AI health check error:', error)
      setConnectionStatus('offline')
      setConnectionMethod('')
    }
  }

  const fetchUserReflections = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('reflections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setUserReflections(data || [])
    } catch (error) {
      console.error('Error fetching reflections:', error)
      // Fall back to localStorage if Supabase fails
      const savedReflections = JSON.parse(localStorage.getItem('reflectraReflections') || '[]')
      setUserReflections(savedReflections.slice(0, 3))
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      console.log('Sending message to AI...')
      const response = await claudeAPI.sendChatMessage(
        userMessage.content,
        userReflections.slice(0, 3) // Send recent reflections for context
      )

      if (response && response.response) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.response,
          timestamp: new Date(),
          isFallback: response.fallback || false,
          provider: response.provider || 'AI Assistant'
        }
        setMessages(prev => [...prev, botMessage])
        
        // Update connection status based on response
        if (response.fallback) {
          setConnectionStatus('fallback')
        } else if (response.success !== false) {
          setConnectionStatus('connected')
        }
      } else {
        throw new Error('No response from AI')
      }
    } catch (error: any) {
      console.error('Error getting AI response:', error)
      setConnectionStatus('offline')
      
      // Provide contextual fallback responses based on user input
      let fallbackContent = ""
      const userInput = userMessage.content.toLowerCase()
      
      if (userInput.includes('value')) {
        fallbackContent = "Values are the compass that guides our decisions. What principles matter most to you in life? Understanding your core values can help you make choices that feel authentic and fulfilling."
      } else if (userInput.includes('goal')) {
        fallbackContent = "Goals give us direction and purpose. What dreams are you working toward? Sometimes breaking big goals into smaller, actionable steps makes them feel more achievable."
      } else if (userInput.includes('struggle') || userInput.includes('difficult') || userInput.includes('problem')) {
        fallbackContent = "Struggles are part of growth. What challenges are you facing right now? Remember, every obstacle is an opportunity to learn something new about yourself."
      } else if (userInput.includes('decision') || userInput.includes('choose') || userInput.includes('choice')) {
        fallbackContent = "Decisions can feel overwhelming. What choice are you trying to make? Sometimes it helps to consider which option aligns best with your values and long-term goals."
      } else if (userInput.includes('stress') || userInput.includes('anxious') || userInput.includes('worried')) {
        fallbackContent = "It's natural to feel stressed sometimes. What's weighing on your mind? Taking a step back and focusing on what you can control often helps bring clarity."
      } else if (userInput.includes('future') || userInput.includes('plan')) {
        fallbackContent = "Planning for the future shows great self-awareness. What vision do you have for yourself? Remember, the future is built through the choices we make today."
      } else if (userInput.includes('relationship') || userInput.includes('friend') || userInput.includes('family')) {
        fallbackContent = "Relationships are such an important part of our lives. What's happening in your relationships that you'd like to explore? Sometimes understanding our own needs helps us connect better with others."
      } else {
        fallbackContent = "I'm here to help you reflect and explore your thoughts. What's been on your mind lately?"
      }
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: fallbackContent,
        timestamp: new Date(),
        isError: true,
        provider: 'Fallback Assistant'
      }

      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Helpers: blob -> base64
  const blobToBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      // strip prefix
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  const playBase64Audio = (base64: string) => {
    try {
      const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
      audio.play();
    } catch (e) {
      console.error('Failed to play audio:', e);
    }
  }

  const handleVoiceStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      recordedChunksRef.current = [];
      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) recordedChunksRef.current.push(ev.data);
      };
      mr.start();
      mediaRecorderRef.current = mr;
    } catch (err) {
      console.error('Microphone access denied or error:', err);
    }
  }

  const handleVoiceStop = async (_duration: number) => {
    try {
      const mr = mediaRecorderRef.current;
      if (mr && mr.state !== 'inactive') {
        mr.stop();
        // Wait small delay for dataavailable events
        await new Promise(r => setTimeout(r, 200));
      }

      const chunks = recordedChunksRef.current;
      if (!chunks || chunks.length === 0) return;

      const blob = new Blob(chunks, { type: 'audio/webm' });
      const base64 = await blobToBase64(blob);

      // Append user transcript (optimistic)
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: '(voice) ' + 'Audio sent',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])

      setIsLoading(true)
      const resp = await claudeAPI.sendVoiceAudio(base64, userReflections.slice(0,3))
      setIsLoading(false)

      if (resp) {
        // display transcription as user message
        if (resp.transcription) {
          const transcriptMsg: Message = {
            id: (Date.now() + 1).toString(),
            type: 'user',
            content: resp.transcription,
            timestamp: new Date()
          }
          setMessages(prev => [...prev, transcriptMsg])
        }

        // display AI response
        if (resp.aiText) {
          const botMessage: Message = {
            id: (Date.now() + 2).toString(),
            type: 'bot',
            content: resp.aiText,
            timestamp: new Date(),
            provider: resp.aiProvider || 'AI Assistant',
            isFallback: resp.fallback || false
          }
          setMessages(prev => [...prev, botMessage])
        }

        // play TTS if provided
        if (resp.audio_base64) {
          playBase64Audio(resp.audio_base64)
        }
      }
    } catch (err) {
      console.error('handleVoiceStop error:', err)
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return connectionMethod ? `AI Connected (${connectionMethod})` : 'AI Connected'
      case 'fallback': return 'Fallback Mode'
      case 'offline': return 'Offline Mode'
      case 'checking': return 'Connecting to AI...'
      default: return 'Unknown'
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi size={12} className="text-emerald-400" />
      case 'fallback': return <Wifi size={12} className="text-amber-400" />
      case 'offline': return <WifiOff size={12} className="text-rose-400" />
      case 'checking': return <Loader2 size={12} className="text-amber-400 animate-spin" />
      default: return <AlertCircle size={12} className="text-gray-400" />
    }
  }

  const getProviderIcon = (provider?: string) => {
    if (provider?.includes('Claude')) {
      return <Sparkles size={16} className="text-amber-600 dark:text-amber-400" />
    } else if (provider?.includes('Gemini')) {
      return <Zap size={16} className="text-rose-600 dark:text-rose-400" />
    } else {
      return <Bot size={16} className="text-amber-600 dark:text-amber-400" />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-end justify-end p-4"
          style={{ 
            zIndex: 99998,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md h-[600px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden"
            style={{ 
              position: 'relative',
              zIndex: 1,
              isolation: 'isolate'
            }}
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-amber-500 to-rose-400 text-white flex items-center justify-between relative overflow-hidden">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent_50%)]"></div>
              </div>
              
              <div className="flex items-center gap-3 relative z-10">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
                >
                  <Sparkles size={18} />
                </motion.div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <div className="flex items-center gap-2">
                    {getStatusIcon()}
                    <p className="text-xs opacity-90">{getStatusText()}</p>
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors relative z-10"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Context Banner for Non-Authenticated Users */}
            {!user && (
              <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-800 dark:text-amber-200">
                  💡 Sign in to get personalized responses based on your reflections
                </p>
              </div>
            )}

            {/* Connection Status Banner */}
            {(connectionStatus === 'offline' || connectionStatus === 'fallback') && (
              <div className={`px-4 py-2 border-b ${
                connectionStatus === 'offline' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className={connectionStatus === 'offline' ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'} />
                  <p className={`text-xs ${connectionStatus === 'offline' ? 'text-red-800 dark:text-red-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
                    {connectionStatus === 'offline' 
                      ? 'AI assistant is having a moment - responses may be limited'
                      : 'Using fallback responses - some features may be limited'
                    }
                  </p>
                  <button
                    onClick={checkAPIConnection}
                    className={`text-xs underline hover:no-underline ${
                      connectionStatus === 'offline' 
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isError
                          ? 'bg-amber-100 dark:bg-amber-900/30'
                          : message.isFallback
                            ? 'bg-amber-100 dark:bg-amber-900/30'
                            : 'bg-gradient-to-br from-amber-100 to-rose-100 dark:from-amber-900/30 dark:to-rose-900/30'
                      }`}
                    >
                      {message.isError ? (
                        <AlertCircle size={16} className="text-amber-600 dark:text-amber-400" />
                      ) : (
                        getProviderIcon(message.provider)
                      )}
                    </motion.div>
                  )}
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`max-w-[80%] p-3 rounded-2xl shadow-md ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-amber-500 to-rose-400 text-white rounded-br-md'
                        : message.isError
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 rounded-bl-md border border-amber-200 dark:border-amber-800'
                          : message.isFallback
                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 rounded-bl-md border border-amber-200 dark:border-amber-800'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className={`text-xs opacity-70 ${
                        message.type === 'user'
                          ? 'text-white'
                          : message.isError
                            ? 'text-amber-700 dark:text-amber-300'
                            : message.isFallback
                              ? 'text-amber-700 dark:text-amber-300'
                              : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {message.provider && message.type === 'bot' && (
                        <p className={`text-xs opacity-70 ${
                          message.isError
                            ? 'text-amber-700 dark:text-amber-300'
                            : message.isFallback
                              ? 'text-amber-700 dark:text-amber-300'
                              : 'text-slate-500 dark:text-slate-400'
                        }`}>
                          {message.provider}
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {message.type === 'user' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-rose-400 flex items-center justify-center flex-shrink-0 shadow-md"
                    >
                      <User size={16} className="text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-amber-500" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about your reflections..."
                  className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={() => setShowVoice((s) => !s)}
                  disabled={isLoading}
                  className="p-2 mr-2 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200"
                  aria-label="Toggle voice input"
                >
                  <Mic size={18} />
                </button>

                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="p-2 bg-gradient-to-r from-amber-500 to-rose-400 hover:from-amber-600 hover:to-rose-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
              {showVoice && (
                <div className="mt-3">
                  <AIVoiceInput onStart={handleVoiceStart} onStop={handleVoiceStop} />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ChatBot
