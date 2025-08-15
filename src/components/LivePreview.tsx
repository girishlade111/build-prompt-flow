import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LivePreviewProps {
  device: 'desktop' | 'tablet' | 'mobile';
  deviceSize: { width: string; height: string };
  className?: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  device,
  deviceSize,
  className
}) => {
  // Mock website content for preview
  const previewContent = `
    <!DOCTYPE html>
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
              Welcome to the Future
            </h1>
            <p class="text-xl text-white/80 mb-8 leading-relaxed">
              Your AI-generated website is taking shape. This is just the beginning of what's possible when you combine creativity with artificial intelligence.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button class="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Get Started
              </button>
              <button class="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
          
          <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl mb-4 mx-auto"></div>
              <h3 class="text-white font-semibold mb-2">AI-Powered</h3>
              <p class="text-white/70 text-sm">Built with cutting-edge artificial intelligence</p>
            </div>
            
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl mb-4 mx-auto"></div>
              <h3 class="text-white font-semibold mb-2">Responsive</h3>
              <p class="text-white/70 text-sm">Looks perfect on all devices and screen sizes</p>
            </div>
            
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div class="w-12 h-12 bg-gradient-to-r from-pink-400 to-red-500 rounded-xl mb-4 mx-auto"></div>
              <h3 class="text-white font-semibold mb-2">Modern</h3>
              <p class="text-white/70 text-sm">Uses the latest web technologies and design trends</p>
            </div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

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