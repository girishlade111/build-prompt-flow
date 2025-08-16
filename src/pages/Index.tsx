
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from '@/components/LandingPage';
import { Workspace } from '@/components/Workspace';
import { useToast } from '@/hooks/use-toast';
import { useCodeGeneration } from '@/hooks/useCodeGeneration';

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const { toast } = useToast();
  const { generateCode } = useCodeGeneration();

  const handlePromptSubmit = async (prompt: string) => {
    console.log('Prompt submitted:', prompt);
    
    // Always switch to workspace view immediately
    setCurrentView('workspace');
    
    toast({
      title: "Generating website...",
      description: `AI is creating your website: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"`,
    });
    
    try {
      const result = await generateCode({
        prompt,
        type: 'generate'
      });
      
      console.log('Generation result:', result);
      
      if (result && result.content) {
        setGeneratedCode(result.content);
        toast({
          title: "Website generated!",
          description: "Your website is ready for editing.",
        });
      } else {
        throw new Error('No content generated');
      }
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation failed",
        description: "There was an error generating your website. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePromptOptimize = async (prompt: string) => {
    // This is handled internally by the PromptBar component now
    return prompt;
  };

  const handleNewProject = () => {
    setCurrentView('landing');
    setGeneratedCode('');
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
              generatedCode={generatedCode}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
