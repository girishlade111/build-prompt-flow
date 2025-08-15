import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Code2, 
  Eye, 
  Monitor, 
  Tablet, 
  Smartphone, 
  ExternalLink,
  History,
  MessageSquare,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PromptBar } from './PromptBar';
import { CodeEditor } from './CodeEditor';
import { LivePreview } from './LivePreview';
import { ChatPanel } from './ChatPanel';
import { VersionHistory } from './VersionHistory';

interface WorkspaceProps {
  onPromptSubmit: (prompt: string) => void;
  onPromptOptimize: (prompt: string) => void;
  onNewProject: () => void;
}

export const Workspace: React.FC<WorkspaceProps> = ({
  onPromptSubmit,
  onPromptOptimize,
  onNewProject
}) => {
  const [activeTab, setActiveTab] = useState('code');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);

  const handlePromptSubmit = (prompt: string) => {
    onPromptSubmit(prompt);
  };

  const deviceIcons = {
    desktop: Monitor,
    tablet: Tablet,
    mobile: Smartphone
  };

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' }
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left Sidebar */}
        <ResizablePanel 
          defaultSize={25} 
          minSize={20} 
          maxSize={40}
          collapsible
          onCollapse={() => setLeftPanelCollapsed(true)}
          onExpand={() => setLeftPanelCollapsed(false)}
        >
          <div className="h-full bg-background-secondary border-r border-border flex flex-col">
            {/* Minimized Prompt Bar */}
            <div className="p-4 border-b border-border">
              <PromptBar
                onSubmit={handlePromptSubmit}
                onOptimize={onPromptOptimize}
                onNewProject={onNewProject}
                isMinimized={true}
              />
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 flex flex-col">
              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 bg-background-tertiary border-b border-border rounded-none">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-background">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="history" className="data-[state=active]:bg-background">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 m-0">
                  <ChatPanel />
                </TabsContent>

                <TabsContent value="history" className="flex-1 m-0">
                  <VersionHistory />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Main Content Area */}
        <ResizablePanel defaultSize={75} minSize={50}>
          <div className="h-full bg-background">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              {/* Tab Headers */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background-secondary">
                <TabsList className="bg-background-tertiary">
                  <TabsTrigger value="code" className="data-[state=active]:bg-background">
                    <Code2 className="w-4 h-4 mr-2" />
                    Code
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="data-[state=active]:bg-background">
                    <Eye className="w-4 h-4 mr-2" />
                    Live Preview
                  </TabsTrigger>
                </TabsList>

                {/* Preview Controls */}
                <AnimatePresence>
                  {activeTab === 'preview' && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-2"
                    >
                      {Object.entries(deviceIcons).map(([device, Icon]) => (
                        <Button
                          key={device}
                          variant={previewDevice === device ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setPreviewDevice(device as typeof previewDevice)}
                          className={cn(
                            "transition-all duration-200",
                            previewDevice === device && "shadow-glow"
                          )}
                        >
                          <Icon className="w-4 h-4" />
                        </Button>
                      ))}
                      
                      <div className="w-px h-6 bg-border mx-2" />
                      
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Tab Content */}
              <div className="flex-1">
                <TabsContent value="code" className="h-full m-0">
                  <CodeEditor />
                </TabsContent>

                <TabsContent value="preview" className="h-full m-0">
                  <LivePreview 
                    device={previewDevice}
                    deviceSize={deviceSizes[previewDevice]}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};