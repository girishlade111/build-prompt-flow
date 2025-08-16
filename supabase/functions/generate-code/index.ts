
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateCodeRequest {
  prompt: string;
  type?: 'optimize' | 'generate';
  context?: {
    files?: string[];
    previousCode?: string;
  };
}

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const geminiApiKey = "AIzaSyDh-pNijNq0oTM19gQauvcY3uc3FohOh2U";
    if (!geminiApiKey) {
      throw new Error('Gemini API key is not configured');
    }

    const { prompt, type = 'generate', context }: GenerateCodeRequest = await req.json();

    if (!prompt) {
      throw new Error('Prompt is required');
    }

    // Prepare the prompt based on request type
    let finalPrompt = '';

    if (type === 'optimize') {
      finalPrompt = `You are an expert prompt optimizer for AI code generation. Your task is to take user prompts and refine them into detailed, structured specifications that will produce better AI-generated code.

Rules for optimization:
1. Add technical specificity and clarity
2. Include design system requirements
3. Specify component structure and behavior
4. Add accessibility and responsive design requirements
5. Include proper TypeScript types and error handling
6. Mention testing considerations
7. Keep the core user intent intact but make it more actionable

Return only the optimized prompt, nothing else.

Optimize this prompt for better AI code generation: "${prompt}"`;
    } else {
      // Generate code
      let systemPrompt = `You are an expert full-stack developer specializing in React, TypeScript, and modern web development. You build beautiful, functional, and well-architected applications.

Core Requirements:
- Use React 18 with TypeScript
- Use Tailwind CSS with the existing design system tokens
- Follow the established component patterns
- Write clean, maintainable, and well-documented code
- Implement proper error handling and loading states
- Ensure responsive design and accessibility
- Use semantic HTML elements

Design System:
- Colors: Use HSL tokens from the design system (--primary, --accent, --background, etc.)
- Never use hardcoded colors like text-white, bg-black
- Use gradient utilities: gradient-primary, gradient-secondary
- Apply smooth transitions and animations
- Use the established spacing and typography scale

Component Structure:
- Create focused, reusable components
- Use proper TypeScript interfaces
- Implement proper prop validation
- Follow React best practices and hooks patterns
- Use motion/framer-motion for animations when appropriate

Code Style:
- Use meaningful variable and function names
- Include JSDoc comments for complex functions
- Organize imports properly (React, libraries, local imports)
- Use const assertions and proper typing
- Implement proper error boundaries where needed

Return only the code, no explanations or markdown formatting.`;

      if (context?.previousCode) {
        systemPrompt += `\n\nExisting Code Context:\n${context.previousCode}`;
      }

      finalPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;
    }

    console.log(`Making Gemini API call for ${type} request`);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: finalPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: type === 'optimize' ? 500 : 8000,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API response received');

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const result = {
      content: data.candidates[0].content.parts[0].text,
      type,
      timestamp: new Date().toISOString()
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-code function:', error);
    
    return new Response(JSON.stringify({ 
      error: error.message,
      type: 'error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
