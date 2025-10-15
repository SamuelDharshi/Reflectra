import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Brain, 
  Target, 
  Zap, 
  Heart, 
  TrendingUp, 
  Shield, 
  Users, 
  Star,
  CheckCircle,
  Share2,
  History
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onStartReflection: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onStartReflection }) => {
  const features = [
    {
      icon: Target,
      title: "Values-Based Decisions",
      description: "Make choices that align with your deepest values and long-term vision.",
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get personalized guidance from advanced AI that understands your unique situation.",
      gradient: "from-violet-500 to-purple-600",
      iconBg: "bg-gradient-to-br from-violet-500 to-purple-600"
    },
    {
      icon: TrendingUp,
      title: "Personal Growth Tracking",
      description: "Monitor your progress and see how your decisions shape your ideal self.",
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600"
    },
    {
      icon: Heart,
      title: "Mood & Wellness",
      description: "Track your emotional state and understand how decisions affect your wellbeing.",
      gradient: "from-rose-500 to-pink-600",
      iconBg: "bg-gradient-to-br from-rose-500 to-pink-600"
    },
    {
      icon: History,
      title: "Reflection History",
      description: "Compare past insights with current thoughts to see your evolution.",
      gradient: "from-blue-500 to-cyan-600",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600"
    },
    {
      icon: Share2,
      title: "Export & Share",
      description: "Save your insights and share meaningful reflections with trusted friends.",
      gradient: "from-indigo-500 to-purple-600",
      iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600"
    }
  ];

  const benefits = [
    "Gain clarity on complex life decisions",
    "Align your actions with your core values",
    "Develop deeper self-awareness",
    "Make confident choices with AI guidance",
    "Track your personal growth journey"
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-24"
    >
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
            <span className="bg-gradient-to-r from-slate-900 via-amber-900 to-rose-900 dark:from-white dark:via-amber-100 dark:to-rose-100 bg-clip-text text-transparent">
              Your AI-Powered
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-500 via-rose-400 to-violet-400 bg-clip-text text-transparent">
              Self-Reflection Tool
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed">
            Transform how you make decisions with AI-powered insights that understand your values, 
            goals, and aspirations. Get personalized guidance that helps you become your ideal self.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -10px rgba(245, 158, 11, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartReflection}
            className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-400 hover:from-amber-600 hover:to-rose-500 text-white rounded-2xl text-lg font-semibold transition-all duration-300 shadow-2xl shadow-amber-500/25 overflow-hidden"
          >
            <span className="relative z-10">Start Your Reflection Journey</span>
            <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGetStarted}
            className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-2 border-amber-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-slate-700 hover:border-amber-300 dark:hover:border-slate-600 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Learn More
          </motion.button>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center items-center gap-8 pt-8"
        >
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Shield size={16} />
            <span className="text-sm font-medium">Privacy First</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Zap size={16} />
            <span className="text-sm font-medium">Instant AI Insights</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Users size={16} />
            <span className="text-sm font-medium">Trusted by Thousands</span>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="space-y-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Everything you need for
            <span className="bg-gradient-to-r from-amber-500 to-rose-400 bg-clip-text text-transparent"> better decisions</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Our AI understands your unique situation and provides personalized guidance 
            that evolves with your growth journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-700/50 hover:border-transparent transition-all duration-300 shadow-xl hover:shadow-3d overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-glow-md transition-all duration-300`}
                >
                  <feature.icon size={28} className="text-white" />
                </motion.div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-amber-600 group-hover:to-rose-500 transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
              
              {/* Corner accent */}
              <div className={`absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300`}></div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="space-y-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                Why choose
                <span className="bg-gradient-to-r from-amber-500 to-rose-400 bg-clip-text text-transparent"> Reflectra?</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Unlike generic advice, our AI creates a personalized reflection of your values, 
                goals, and aspirations to guide every decision.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + 0.1 * index }}
                  className="flex items-center gap-4"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-white" />
                  </div>
                  <span className="text-lg text-slate-700 dark:text-slate-300 font-medium">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              onClick={onStartReflection}
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-400 hover:from-amber-600 hover:to-rose-500 text-white rounded-2xl text-lg font-semibold transition-all duration-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105"
            >
              Try It Now - Free
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            {/* App preview mockup */}
            <div className="relative bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950/50 dark:to-rose-950/50 rounded-3xl p-8 border border-amber-200/50 dark:border-amber-800/50">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-400 flex items-center justify-center">
                    <Brain size={24} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">AI Reflection</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Personalized insights</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-amber-500 to-rose-400 rounded-full"></div>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-3/5 bg-gradient-to-r from-amber-500 to-rose-400 rounded-full"></div>
                  </div>
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-4/6 bg-gradient-to-r from-amber-500 to-rose-400 rounded-full"></div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-1 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Star size={16} className="text-amber-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Core Values</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                    </div>
                  </div>
                  <div className="flex-1 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} className="text-rose-500" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Life Goals</span>
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
            Ready to discover your
            <span className="bg-gradient-to-r from-amber-500 to-rose-400 bg-clip-text text-transparent"> true potential?</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Join thousands of people who are making better decisions and living more authentic lives 
            with AI-powered self-reflection.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onStartReflection}
            className="group flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-rose-400 hover:from-amber-600 hover:to-rose-500 text-white rounded-2xl text-xl font-bold transition-all duration-300 shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105"
          >
            Start Your Journey - Free
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-sm text-slate-500 dark:text-slate-500"
        >
          Free to start • No credit card required • Privacy protected • Powered by Claude AI
        </motion.p>
      </section>
    </motion.div>
  );
};

export default LandingPage;