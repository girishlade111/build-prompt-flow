import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit3, Sparkles, Send, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCodeGeneration } from '@/hooks/useCodeGeneration';

interface PromptBarProps {
  onSubmit: (prompt: string) => void;
  onOptimize: (prompt: string) => void;
  onNewProject: () => void;
  isMinimized?: boolean;
  className?: string;
}

export const PromptBar: React.FC<PromptBarProps> = ({
  onSubmit,
  onOptimize,
  onNewProject,
  isMinimized = false,
  className
}) => {
  const [prompt, setPrompt] = useState('');
  const { optimizePrompt, isGenerating } = useCodeGeneration();
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;
    
    await onSubmit(prompt);
  };

  const handleOptimize = async () => {
    if (!prompt.trim() || isGenerating || isOptimizing) return;
    
    setIsOptimizing(true);
    try {
      const optimizedPrompt = await optimizePrompt(prompt);
      if (optimizedPrompt) {
        setPrompt(optimizedPrompt);
      }
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ scale: 1, y: 0 }}
      animate={{
        scale: isMinimized ? 0.9 : 1,
        y: isMinimized ? 0 : 0
      }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className={cn(
        "relative",
        isMinimized ? "w-full" : "max-w-4xl mx-auto",
        className
      )}
    >
      <div className="relative">
        {!isMinimized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -inset-1 gradient-primary rounded-2xl blur-xl opacity-30"
          />
        )}
        
        <div className={cn(
          "relative bg-card border border-card-border rounded-2xl p-6 shadow-lg",
          !isMinimized && "shadow-glow"
        )}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Edit3 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your website idea..."
                  className={cn(
                    "pl-12 pr-4 py-6 text-lg bg-background-secondary border-border",
                    "focus:ring-2 focus:ring-primary focus:border-transparent",
                    "transition-all duration-300"
                  )}
                  disabled={isGenerating || isOptimizing}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleOptimize}
                  disabled={!prompt.trim() || isGenerating || isOptimizing}
                  className="px-4 py-6 border-border hover:border-accent hover:bg-accent/10 transition-all duration-300"
                >
                  {isOptimizing ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                    />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </Button>
                
                <Button
                  type="submit"
                  size="lg"
                  disabled={!prompt.trim() || isGenerating || isOptimizing}
                  className={cn(
                    "px-6 py-6 gradient-primary text-primary-foreground",
                    "hover:shadow-glow transition-all duration-300",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isGenerating ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>
            
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center justify-between"
              >
                <p className="text-sm text-muted-foreground">
                  Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd> to generate or use the optimize button for better results
                </p>
                
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onNewProject}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Button>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </motion.div>
  );
};