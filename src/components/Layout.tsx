import React, { useState } from 'react';
import { Moon, Sun, LogIn, UserPlus, MessageCircle, Brain, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';
import UserMenu from './UserMenu';
import ChatBot from './ChatBot';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [darkMode, setDarkMode] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [chatBotOpen, setChatBotOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  React.useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const openAuthModal = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleChatOpen = () => {
    setChatBotOpen(true);
    setMobileMenuOpen(false);
  };

  const navigateToLanding = () => {
    window.location.href = '/';
  };

  return (
    <div 
      className="min-h-screen flex flex-col transition-all duration-700 bg-gradient-to-br from-amber-50 via-white to-rose-50 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/30"
      style={{ 
        position: 'relative',
        isolation: 'isolate'
      }}
    >
      {/* Subtle page overlay so background image shows through but text remains readable */}
  <div className="fixed inset-0 pointer-events-none bg-white/5 dark:bg-slate-900/20 backdrop-blur-sm" style={{ zIndex: 5 }}></div>
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-br from-amber-400/20 to-rose-400/20 rounded-full blur-3xl"
        ></motion.div>
        
        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-40 -left-40 w-60 h-60 md:w-80 md:h-80 bg-gradient-to-tr from-rose-400/20 to-amber-400/20 rounded-full blur-3xl"
        ></motion.div>
        
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-r from-violet-400/10 to-amber-400/10 rounded-full blur-3xl"
        ></motion.div>
      </div>
      
      {/* Header */}
      <header 
        className="relative backdrop-blur-xl bg-white/60 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0"
        style={{ zIndex: 40 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.button 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              onClick={navigateToLanding}
              className="flex items-center gap-2 md:gap-4 hover:opacity-80 transition-opacity duration-300 cursor-pointer group"
            >
              <div className="relative">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-500 to-rose-400 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-shadow duration-300">
                  <Brain className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-2 h-2 md:w-4 md:h-4 bg-gradient-to-r from-rose-400 to-amber-500 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent group-hover:from-amber-500 group-hover:to-rose-400 transition-all duration-300">
                  Reflectra
                </h1>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 font-medium">Your Digital Twin for Daily Decisions</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent group-hover:from-amber-500 group-hover:to-rose-400 transition-all duration-300">
                  Reflectra
                </h1>
              </div>
            </motion.button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              {!loading && (
                <>
                  {user ? (
                    <UserMenu onChatOpen={() => setChatBotOpen(true)} />
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openAuthModal('signin')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        <LogIn size={16} />
                        Sign In
                      </button>
                      <button
                        onClick={() => openAuthModal('signup')}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-400 hover:from-amber-600 hover:to-rose-500 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105"
                      >
                        <UserPlus size={16} />
                        Get Started
                      </button>
                    </div>
                  )}
                </>
              )}
              
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={toggleDarkMode}
                className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </motion.button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex md:hidden items-center gap-2">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </motion.button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50"
              >
                {!loading && (
                  <div className="space-y-3">
                    {user ? (
                      <UserMenu onChatOpen={handleChatOpen} isMobile={true} />
                    ) : (
                      <div className="space-y-3">
                        <button
                          onClick={() => openAuthModal('signin')}
                          className="w-full flex items-center justify-center gap-2 p-3 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-xl font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          <LogIn size={18} />
                          Sign In
                        </button>
                        <button
                          onClick={() => openAuthModal('signup')}
                          className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-amber-500 to-rose-400 text-white rounded-xl font-semibold transition-all duration-300"
                        >
                          <UserPlus size={18} />
                          Get Started
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative flex-1" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-16 pb-24 md:pb-32">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Floating Chat Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleChatOpen}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-amber-500 to-rose-400 hover:from-amber-600 hover:to-rose-500 text-white rounded-2xl shadow-2xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all duration-300 flex items-center justify-center group z-50 relative overflow-hidden"
        aria-label="Open AI Chat Assistant"
      >
        {/* Shimmer effect */}
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <MessageCircle size={24} className="relative z-10" />
        </motion.div>
        
        {/* Pulse rings */}
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-2xl bg-amber-400"
        />
        
        {/* Tooltip - Hidden on mobile */}
        <div className="hidden md:block absolute right-full mr-4 px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
          Chat with AI Assistant
          <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-100 rotate-45"></div>
        </div>
      </motion.button>
      
      {/* Footer */}
      <footer 
        className="relative backdrop-blur-xl bg-white/60 dark:bg-slate-900/80 border-t border-slate-200/50 dark:border-slate-700/50"
        style={{ zIndex: 40 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8">
          <div className="text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {new Date().getFullYear()} Reflectra. Empowering authentic decisions through AI.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />

      <ChatBot
        isOpen={chatBotOpen}
        onClose={() => setChatBotOpen(false)}
      />
    </div>
  );
};

export default Layout;