import React from 'react';
import { motion } from 'framer-motion';
import ChipInput from '../ChipInput';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';
import { Target, TrendingUp, Zap } from 'lucide-react';

interface LifeGoalsStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const LifeGoalsStep: React.FC<LifeGoalsStepProps> = ({ 
  userData, 
  updateUserData, 
  onNext,
  onBack
}) => {
  const handleGoalsChange = (goals: string[]) => {
    updateUserData({ lifeGoals: goals });
  };

  const isNextDisabled = userData.lifeGoals.length === 0;

  const goalCategories = [
    {
      title: "Career & Professional",
      goals: ["Start a business", "Get promoted", "Change careers", "Learn new skills", "Build a network"]
    },
    {
      title: "Personal Development",
      goals: ["Read 50 books", "Learn a language", "Master a hobby", "Improve confidence", "Develop leadership"]
    },
    {
      title: "Health & Wellness",
      goals: ["Run a marathon", "Eat healthier", "Meditate daily", "Lose weight", "Build strength"]
    },
    {
      title: "Relationships & Life",
      goals: ["Travel the world", "Buy a home", "Start a family", "Strengthen friendships", "Give back to community"]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-r from-amber-500 to-rose-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/25"
        >
          <Target size={32} className="text-white" />
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
        >
          What do you want to achieve?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
        >
          Your life goals give direction to your journey and align with your core values. 
          What meaningful achievements would make you proud?
        </motion.p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card"
      >
        <ChipInput 
          label="Your Life Goals"
          value={userData.lifeGoals}
          onChange={handleGoalsChange}
          placeholder="Type a goal and press Enter..."
          maxChips={5}
          helperText="Choose up to 5 important goals you want to achieve"
        />
        
        <div className="mt-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={20} className="text-green-600 dark:text-green-400" />
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Explore different areas of life:</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {goalCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group p-6 bg-gradient-to-br from-slate-50 to-green-50 dark:from-slate-800/50 dark:to-green-950/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 hover:border-green-300/50 dark:hover:border-green-700/50 transition-all duration-300 shadow-lg hover:shadow-xl relative overflow-hidden"
              >
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Zap size={18} className="text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h5 className="font-bold text-slate-900 dark:text-white">{category.title}</h5>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {category.goals.map((goal) => {
                      const isSelected = userData.lifeGoals.includes(goal);
                      const isDisabled = !isSelected && userData.lifeGoals.length >= 5;
                      
                      return (
                        <motion.button
                          key={goal}
                          type="button"
                          onClick={() => {
                            if (!isSelected && !isDisabled) {
                              handleGoalsChange([...userData.lifeGoals, goal]);
                            }
                          }}
                          disabled={isDisabled}
                          whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
                          whileTap={!isDisabled ? { scale: 0.95 } : {}}
                          className={`px-3 py-1.5 text-sm rounded-xl transition-all duration-200 ${
                            isSelected
                              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30 scale-105'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-600 hover:bg-green-50 dark:hover:bg-green-950/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md'
                          }`}
                        >
                          {goal}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Corner decoration */}
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-green-400/10 rounded-full blur-2xl group-hover:bg-green-400/20 transition-all duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
      
      <ProgressButton 
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={isNextDisabled}
      />
    </motion.div>
  );
};

export default LifeGoalsStep;