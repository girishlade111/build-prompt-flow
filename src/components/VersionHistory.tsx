import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  RotateCcw, 
  GitBranch, 
  Clock,
  FileText,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VersionEntry {
  id: string;
  timestamp: Date;
  description: string;
  prompt: string;
  changes: string[];
  isCurrent?: boolean;
}

interface VersionHistoryProps {
  className?: string;
}

export const VersionHistory: React.FC<VersionHistoryProps> = ({ className }) => {
  const [versions] = useState<VersionEntry[]>([
    {
      id: '3',
      timestamp: new Date(),
      description: 'Added responsive navigation and hero section',
      prompt: 'Create a modern landing page with navigation and hero section',
      changes: ['Added navigation component', 'Created hero section', 'Implemented responsive design'],
      isCurrent: true
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      description: 'Initial project setup with Tailwind CSS',
      prompt: 'Set up a new React project with modern styling',
      changes: ['Project initialization', 'Tailwind CSS setup', 'Basic component structure']
    },
    {
      id: '1',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      description: 'Project created',
      prompt: 'Create a new website',
      changes: ['Initial commit']
    }
  ]);

  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);

  const handleRestore = (versionId: string) => {
    console.log('Restoring version:', versionId);
    // Implement version restoration logic
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={cn("h-full flex flex-col bg-background", className)}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-sm">Version History</h3>
          <Badge variant="secondary" className="text-xs">
            {versions.length}
          </Badge>
        </div>
      </div>

      {/* Version List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer",
                version.isCurrent 
                  ? "bg-primary/5 border-primary/20" 
                  : "bg-background-secondary border-border hover:border-accent/30",
                selectedVersion === version.id && "ring-2 ring-accent/50"
              )}
              onClick={() => setSelectedVersion(selectedVersion === version.id ? null : version.id)}
            >
              {/* Timeline Connector */}
              {index < versions.length - 1 && (
                <div className="absolute left-6 top-12 w-px h-8 bg-border" />
              )}

              <div className="flex items-start gap-3">
                {/* Version Icon */}
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative",
                  version.isCurrent
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {version.isCurrent ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <GitBranch className="w-4 h-4" />
                  )}
                </div>

                {/* Version Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm truncate">
                      {version.description}
                    </h4>
                    {version.isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(version.timestamp)}</span>
                    <span>•</span>
                    <span>v{version.id}</span>
                  </div>

                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    "{version.prompt}"
                  </p>

                  {/* Changes List */}
                  {selectedVersion === version.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-3"
                    >
                      <div className="space-y-1">
                        {version.changes.map((change, changeIndex) => (
                          <div key={changeIndex} className="flex items-center gap-2 text-xs">
                            <FileText className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{change}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Actions */}
                  {!version.isCurrent && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(version.id);
                        }}
                        className="h-7 text-xs"
                      >
                        <RotateCcw className="w-3 h-3 mr-1" />
                        Restore
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};