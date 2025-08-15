import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/LandingPage';
import { Workspace } from '@/components/Workspace';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const { toast } = useToast();

  const handlePromptSubmit = async (prompt: string) => {
    toast({
      title: "Generating website...",
      description: `Creating your website: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`,
    });
    
    // Simulate generation process
    setTimeout(() => {
      setCurrentView('workspace');
      toast({
        title: "Website generated!",
        description: "Your website is ready for editing.",
      });
    }, 2000);
  };

  const handlePromptOptimize = async (prompt: string) => {
    toast({
      title: "Optimizing prompt...",
      description: "AI is refining your prompt for better results.",
    });
    
    // Simulate optimization
    setTimeout(() => {
      toast({
        title: "Prompt optimized!",
        description: "Your prompt has been enhanced for better AI output.",
      });
    }, 1500);
  };

  const handleNewProject = () => {
    setCurrentView('landing');
    toast({
      title: "New project started",
      description: "Ready to build something amazing!",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage
              onPromptSubmit={handlePromptSubmit}
              onPromptOptimize={handlePromptOptimize}
              onNewProject={handleNewProject}
            />
          </motion.div>
        ) : (
          <motion.div
            key="workspace"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Workspace
              onPromptSubmit={handlePromptSubmit}
              onPromptOptimize={handlePromptOptimize}
              onNewProject={handleNewProject}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
