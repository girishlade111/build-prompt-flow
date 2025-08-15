import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PromptBar } from './PromptBar';
import { cn } from '@/lib/utils';

interface LandingPageProps {
  onPromptSubmit: (prompt: string) => void;
  onPromptOptimize: (prompt: string) => void;
  onNewProject: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onPromptSubmit,
  onPromptOptimize,
  onNewProject
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePromptSubmit = (prompt: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      onPromptSubmit(prompt);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 gradient-primary rounded-full blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-accent to-primary rounded-full blur-3xl opacity-15 animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LC</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Lade Coder</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Examples
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Pricing
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 gradient-primary rounded-lg text-primary-foreground text-sm font-medium cursor-pointer shadow-glow"
            >
              Sign In
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <AnimatePresence>
          {!isAnimating && (
            <motion.div
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex flex-col items-center justify-center px-6"
            >
              <div className="max-w-4xl mx-auto text-center space-y-8">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-4"
                >
                  <h1 className="text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                    Describe it.{' '}
                    <span className="gradient-primary bg-clip-text text-transparent">
                      Watch it build.
                    </span>
                    {' '}Edit it live.
                  </h1>
                  
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    The most advanced AI-powered website builder. Turn your ideas into fully functional, 
                    responsive websites using just plain language.
                  </p>
                </motion.div>

                {/* Prompt Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative"
                >
                  <PromptBar
                    onSubmit={handlePromptSubmit}
                    onOptimize={onPromptOptimize}
                    onNewProject={onNewProject}
                  />
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-wrap items-center justify-center gap-3"
                >
                  {[
                    '⚡ Instant Generation',
                    '🎨 Live Editing',
                    '📱 Responsive Design',
                    '🚀 One-Click Deploy'
                  ].map((feature, index) => (
                    <motion.div
                      key={feature}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-background-secondary border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-300"
                    >
                      {feature}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex items-center justify-center gap-8 text-sm text-muted-foreground"
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">10K+</div>
                    <div>Websites Created</div>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">50M+</div>
                    <div>Lines of Code</div>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">99.9%</div>
                    <div>Uptime</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="p-6 text-center text-sm text-muted-foreground"
        >
          <p>Powered by advanced AI • Built for developers and creators</p>
        </motion.footer>
      </div>
    </div>
  );
};