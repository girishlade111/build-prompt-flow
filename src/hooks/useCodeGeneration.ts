import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CodeGenerationOptions {
  prompt: string;
  type?: 'optimize' | 'generate';
  context?: {
    files?: string[];
    previousCode?: string;
  };
}

interface GeneratedCode {
  content: string;
  type: string;
  timestamp: string;
}

export const useCodeGeneration = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedCode, setStreamedCode] = useState('');
  const { toast } = useToast();

  const generateCode = useCallback(async (options: CodeGenerationOptions): Promise<GeneratedCode | null> => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-code', {
        body: options
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      return data as GeneratedCode;
    } catch (error) {
      console.error('Code generation error:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const streamCode = useCallback(async (
    options: Omit<CodeGenerationOptions, 'type'>,
    onChunk: (chunk: string) => void,
    onComplete: () => void
  ) => {
    setIsStreaming(true);
    setStreamedCode('');

    try {
      const response = await fetch(
        `https://yefqxifcpzonvjlkovho.supabase.co/functions/v1/stream-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZnF4aWZjcHpvbnZqbGtvdmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTAwNTIsImV4cCI6MjA3MDU4NjA1Mn0.tDHTQ3UOKnknOiM9b9zmz3zW3nt_X1LqLDikgL-NrIM`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZnF4aWZjcHpvbnZqbGtvdmhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMTAwNTIsImV4cCI6MjA3MDU4NjA1Mn0.tDHTQ3UOKnknOiM9b9zmz3zW3nt_X1LqLDikgL-NrIM',
          },
          body: JSON.stringify(options),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let accumulatedCode = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content' && parsed.content) {
                accumulatedCode += parsed.content;
                setStreamedCode(accumulatedCode);
                onChunk(parsed.content);
              } else if (parsed.type === 'done') {
                onComplete();
                return;
              }
            } catch (parseError) {
              console.warn('Failed to parse stream data:', parseError);
            }
          }
        }
      }

      onComplete();
    } catch (error) {
      console.error('Streaming error:', error);
      toast({
        title: 'Streaming Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsStreaming(false);
    }
  }, [toast]);

  const optimizePrompt = useCallback(async (prompt: string): Promise<string | null> => {
    const result = await generateCode({ prompt, type: 'optimize' });
    return result?.content || null;
  }, [generateCode]);

  return {
    generateCode,
    streamCode,
    optimizePrompt,
    isGenerating,
    isStreaming,
    streamedCode,
  };
};