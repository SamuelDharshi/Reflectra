import React from 'react';
import { motion } from 'framer-motion';
import ProgressButton from '../ProgressButton';
import { UserData } from '../../types';

interface IdealSelfStepProps {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const IdealSelfStep: React.FC<IdealSelfStepProps> = ({ 
  userData, 
  updateUserData, 
  onNext,
  onBack
}) => {
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateUserData({ idealSelf: e.target.value });
  };

  const isNextDisabled = !userData.idealSelf || userData.idealSelf.length < 20;
  const characterCount = userData.idealSelf ? userData.idealSelf.length : 0;
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
        <h2 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-3">Your Ideal Self</h2>
        <p className="text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Imagine the best version of yourself. How would you describe this person? 
          What qualities, habits, and achievements would they have?
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card relative overflow-hidden group"
      >
        {/* Decorative gradient */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-rose-400/10 rounded-bl-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="form-group relative z-10">
          <label htmlFor="ideal-self" className="block text-lg font-semibold mb-3 text-slate-900 dark:text-white flex items-center gap-2">
            Describe your ideal self
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-amber-500"
            >
              ✨
            </motion.span>
          </label>
          <motion.textarea
            whileFocus={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
            id="ideal-self"
            value={userData.idealSelf}
            onChange={handleTextChange}
            placeholder="I envision myself as someone who is confident, compassionate, and purposeful. I wake up each day energized and grateful, pursuing meaningful work that aligns with my values..."
            className="textarea focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all duration-300"
            rows={8}
            maxLength={maxChars}
          />
          <div className="flex justify-between mt-3">
            <motion.span
              animate={characterCount < minChars ? { x: [0, -2, 2, 0] } : {}}
              transition={{ duration: 0.5 }}
              className={`text-sm font-medium ${characterCount < minChars ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}
            >
              {characterCount < minChars ? `${minChars - characterCount} more characters needed` : '✓ Looking good!'}
            </motion.span>
            <span className={`text-sm font-medium ${characterCount > maxChars * 0.9 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {characterCount}/{maxChars}
            </span>
          </div>
        </div>
        
        <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30 rounded-2xl border border-amber-200/50 dark:border-amber-800/50">
          <h4 className="text-sm font-semibold mb-3 text-amber-700 dark:text-amber-300 flex items-center gap-2">
            <span className="text-lg">💡</span>
            Need help getting started?
          </h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Consider addressing these aspects in your description:
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            {[
              'Personal qualities and character traits',
              'Daily habits and routines',
              'How you handle challenges',
              'Your impact on others and the world',
              'Balance between different life areas'
            ].map((item, i) => (
              <motion.li
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="flex items-start gap-2"
              >
                <span className="text-amber-500 mt-0.5">→</span>
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

export default IdealSelfStep;