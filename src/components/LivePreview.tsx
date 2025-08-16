
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LivePreviewProps {
  device: 'desktop' | 'tablet' | 'mobile';
  deviceSize: { width: string; height: string };
  className?: string;
  generatedCode?: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  device,
  deviceSize,
  className,
  generatedCode
}) => {
  // Use generated code if available, otherwise show default content
  const previewContent = generatedCode && generatedCode.trim() ? 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Generated Website</title>
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
      <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; margin: 0; padding: 0; }
      </style>
    </head>
    <body>
      <div id="root"></div>
      <script type="text/babel">
        ${generatedCode}
        
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
      </script>
    </body>
    </html>` :
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>AI Generated Website</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
      </style>
    </head>
    <body class="bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 min-h-screen">
      <div class="min-h-screen flex items-center justify-center p-8">
        <div class="max-w-4xl mx-auto text-center">
          <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-12 shadow-2xl border border-white/20">
            <h1 class="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Ready to Generate
            </h1>
            <p class="text-xl text-white/80 mb-8 leading-relaxed">
              Enter a prompt above to generate your custom website. The AI will create a beautiful, responsive design based on your requirements.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button class="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Start Building
              </button>
              <button class="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>`;

  return (
    <div className={cn("h-full bg-background-secondary flex items-center justify-center p-6", className)}>
      <motion.div
        key={device}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "bg-background border border-border rounded-2xl overflow-hidden shadow-xl",
          device === 'mobile' && "mx-auto",
          device === 'tablet' && "mx-auto",
          device === 'desktop' && "w-full h-full"
        )}
        style={{
          width: device === 'desktop' ? '100%' : deviceSize.width,
          height: device === 'desktop' ? '100%' : deviceSize.height,
          maxWidth: '100%',
          maxHeight: '100%'
        }}
      >
        {/* Device Frame (only for mobile/tablet) */}
        {device !== 'desktop' && (
          <div className="bg-background-tertiary px-4 py-2 border-b border-border flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        )}
        
        {/* Preview Content */}
        <div className="w-full h-full">
          <iframe
            srcDoc={previewContent}
            className="w-full h-full border-0"
            title="Website Preview"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </motion.div>
    </div>
  );
};
