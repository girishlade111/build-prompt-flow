
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
      let systemPrompt = `You are an expert web developer specializing in HTML, CSS, JavaScript/TypeScript, and modern web development. You create beautiful, functional, and responsive websites and applications.

CRITICAL INSTRUCTIONS:
- Generate separate files for HTML, CSS, and JavaScript/TypeScript
- Create a complete, functional website/application
- Use modern, clean, and professional design
- Ensure responsive design that works on all devices
- Implement smooth animations and transitions
- Use semantic HTML5 elements
- Write efficient, well-structured, properly formatted and indented code
- Ensure all code is properly formatted with correct indentation and spacing

MANDATORY FILE STRUCTURE REQUIREMENTS:
You MUST return the code in this EXACT JSON format with proper formatting:
{
  "files": {
    "index.html": "Complete HTML content with proper DOCTYPE, head, and body sections",
    "styles.css": "Complete CSS content with proper formatting and comments", 
    "script.js": "Complete JavaScript content with proper formatting and comments"
  }
}

HTML Requirements:
- Use semantic HTML5 elements (header, main, section, article, nav, footer)
- Include proper meta tags for SEO and responsiveness
- Link to external fonts (Google Fonts) if needed
- Include proper DOCTYPE and language attributes
- Link to styles.css and script.js files with proper relative paths
- Use proper indentation (2 or 4 spaces consistently)
- Include meaningful class names and IDs
- Ensure accessibility with proper ARIA labels and alt texts

CSS Requirements:
- Use modern CSS features (Grid, Flexbox, CSS Variables)
- Implement responsive design with media queries
- Use beautiful color schemes and typography
- Add smooth transitions and hover effects
- Ensure accessibility with proper contrast ratios
- Use CSS Grid and Flexbox for layouts
- Organize CSS with proper comments and sections
- Use proper indentation and formatting
- Include CSS reset or normalize styles
- Use meaningful class names following BEM or similar methodology

JavaScript Requirements:
- Use modern ES6+ syntax
- Implement interactive features and animations
- Add event listeners for user interactions
- Use proper error handling with try-catch blocks
- Write clean, modular, and well-commented code
- Include form validation if forms are present
- Use proper indentation and formatting
- Follow best practices for variable naming and function structure
- Ensure code is optimized and efficient

Design Guidelines:
- Create beautiful, modern interfaces
- Use consistent spacing and typography
- Implement smooth animations and micro-interactions
- Ensure excellent user experience
- Make it visually appealing and professional
- Use appropriate color schemes and contrast
- Ensure mobile-first responsive design
- Include loading states and error handling for better UX

FORMATTING REQUIREMENTS:
- All code must be properly indented
- Use consistent spacing and line breaks
- Include proper comments explaining complex logic
- Follow industry best practices for code structure
- Ensure code is readable and maintainable

Return ONLY the JSON object with the properly formatted file contents. Do not include any markdown formatting, explanations, or additional text.`;

      if (context?.previousCode) {
        systemPrompt += `\n\nExisting Code Context:\n${context.previousCode}`;
      }

      finalPrompt = `${systemPrompt}\n\nUser request: ${prompt}`;
    }

    console.log(`Making Gemini API call for ${type} request`);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${geminiApiKey}`, {
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

    let content = data.candidates[0].content.parts[0].text;
    
    // For code generation, try to parse as JSON to extract files
    if (type === 'generate') {
      try {
        // Clean the content and try to extract JSON
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsedContent = JSON.parse(cleanContent);
        if (parsedContent.files) {
          content = parsedContent;
        }
      } catch (e) {
        // If parsing fails, keep original content
        console.log('Could not parse as JSON, keeping original content');
      }
    }

    const result = {
      content: content,
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
