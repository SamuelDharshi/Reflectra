import React from 'react';
import { motion } from 'framer-motion';
import ChipInput from '../ChipInput';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';

interface CurrentStrugglesStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const CurrentStrugglesStep: React.FC<CurrentStrugglesStepProps> = ({ 
  userData, 
  updateUserData, 
  onNext,
  onBack
}) => {
  const handleStrugglesChange = (struggles: string[]) => {
    updateUserData({ currentStruggles: struggles });
  };

  const isNextDisabled = userData.currentStruggles.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-16 h-16 rounded-3xl bg-gradient-to-r from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/25"
        >
          <span className="text-4xl">💪</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4"
        >
          What challenges are you facing?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
        >
          We all face challenges on our journey. Acknowledging your struggles is the first step toward overcoming them.
        </motion.p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card"
      >
        <ChipInput 
          label="Your Current Struggles"
          value={userData.currentStruggles}
          onChange={handleStrugglesChange}
          placeholder="E.g., Work-life balance, Procrastination"
          maxChips={5}
          helperText="Add up to 5 challenges you're currently facing"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-2xl border border-violet-200/50 dark:border-violet-800/50"
        >
          <h4 className="text-sm font-semibold mb-4 text-violet-700 dark:text-violet-300 flex items-center gap-2">
            <span className="text-lg">🌟</span>
            Common struggles people face:
          </h4>
          <div className="flex flex-wrap gap-2">
            {['Self-doubt', 'Lack of motivation', 'Career uncertainty', 'Financial stress', 
              'Relationship challenges', 'Health issues', 'Finding purpose'].map((example, i) => (
              <motion.button
                key={example}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => {
                  if (!userData.currentStruggles.includes(example) && userData.currentStruggles.length < 5) {
                    handleStrugglesChange([...userData.currentStruggles, example]);
                  }
                }}
                disabled={userData.currentStruggles.includes(example) || userData.currentStruggles.length >= 5}
                className={`px-3 py-2 text-sm rounded-xl transition-all duration-200 ${
                  userData.currentStruggles.includes(example)
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-violet-200 dark:border-violet-700 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md'
                }`}
              >
                {example}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      <ProgressButton 
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={isNextDisabled}
      />
    </motion.div>
  );
};

export default CurrentStrugglesStep;