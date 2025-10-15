import React from 'react';
import { motion } from 'framer-motion';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';

interface DecisionStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const DecisionStep: React.FC<DecisionStepProps> = ({ 
  userData, 
  updateUserData, 
  onNext,
  onBack
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateUserData({ currentDecision: e.target.value });
  };

  const isNextDisabled = !userData.currentDecision || userData.currentDecision.length < 20;
  const characterCount = userData.currentDecision ? userData.currentDecision.length : 0;
  const minChars = 20;
  const maxChars = 500;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-3">Current Decision or Dilemma</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          What important decision or dilemma are you currently facing? Describe the situation and what makes it challenging.
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card relative overflow-hidden group"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-400/10 to-violet-400/10 rounded-bl-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="form-group relative z-10">
          <label htmlFor="current-decision" className="block text-lg font-semibold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
            Describe your current decision or dilemma
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-rose-500"
            >
              🤔
            </motion.span>
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            id="current-decision"
            value={userData.currentDecision}
            onChange={handleTextChange}
            placeholder="I'm currently trying to decide whether to pursue a new career opportunity that aligns with my passions but requires relocating, or stay in my current stable position..."
            className="textarea focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500 transition-all duration-300"
            rows={8}
            maxLength={maxChars}
          />
          <div className="flex justify-between mt-3">
            <motion.span
              animate={characterCount < minChars ? { x: [0, -2, 2, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={`text-sm font-medium ${characterCount < minChars ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}
            >
              {characterCount < minChars ? `${minChars - characterCount} more characters needed` : '✓ Perfect!'}
            </motion.span>
            <span className={`text-sm font-medium ${characterCount > maxChars * 0.9 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {characterCount}/{maxChars}
            </span>
          </div>
        </div>
        
        <div className="mt-6 p-6 bg-gradient-to-br from-rose-50 to-violet-50 dark:from-rose-950/30 dark:to-violet-950/30 rounded-2xl border border-rose-200/50 dark:border-rose-800/50">
          <h4 className="text-sm font-semibold mb-3 text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <span className="text-lg">💭</span>
            Tips for describing your decision:
          </h4>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            {[
              'What are the main options you\'re considering?',
              'What\'s at stake in this decision?',
              'What factors are making this choice difficult?',
              'What potential outcomes are you concerned about?',
              'How does this decision relate to your values and goals?'
            ].map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="text-rose-500 mt-0.5">→</span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>
      
      <ProgressButton 
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={isNextDisabled}
        isLastStep={true}
      />
    </motion.div>
  );
};

export default DecisionStep;