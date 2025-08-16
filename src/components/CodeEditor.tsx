
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  Save, 
  Download, 
  Copy, 
  RotateCcw,
  FileText,
  Folder,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileTreeItem {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileTreeItem[];
  isOpen?: boolean;
}

interface CodeEditorProps {
  className?: string;
  generatedCode?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ className, generatedCode }) => {
  const [currentFile, setCurrentFile] = useState('App.tsx');
  const [code, setCode] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const [fileTree, setFileTree] = useState<FileTreeItem[]>([
    {
      name: 'src',
      type: 'folder',
      isOpen: true,
      children: [
        { name: 'App.tsx', type: 'file', content: '' },
        { name: 'index.css', type: 'file', content: '/* Styles will be generated here */' },
        { name: 'components', type: 'folder', isOpen: false, children: [] }
      ]
    },
    { name: 'package.json', type: 'file', content: '{}' }
  ]);

  // Update the file tree when generatedCode changes
  useEffect(() => {
    if (generatedCode && generatedCode.trim()) {
      setFileTree(prev => 
        prev.map(item => {
          if (item.name === 'src') {
            return {
              ...item,
              children: item.children?.map(child => 
                child.name === 'App.tsx' 
                  ? { ...child, content: generatedCode }
                  : child
              )
            };
          }
          return item;
        })
      );
      
      // Update current code if viewing App.tsx
      if (currentFile === 'App.tsx') {
        setCode(generatedCode);
      }
    }
  }, [generatedCode, currentFile]);

  useEffect(() => {
    // Load file content when currentFile changes
    const findFile = (items: FileTreeItem[], fileName: string): string => {
      for (const item of items) {
        if (item.type === 'file' && item.name === fileName) {
          return item.content || '';
        }
        if (item.type === 'folder' && item.children) {
          const found = findFile(item.children, fileName);
          if (found) return found;
        }
      }
      return '';
    };
    
    const fileContent = findFile(fileTree, currentFile);
    setCode(fileContent);
  }, [currentFile, fileTree]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleSave = () => {
    console.log('Saving code...');
  };

  const handleDownload = () => {
    console.log('Downloading project...');
  };

  const renderFileTree = (items: FileTreeItem[], depth = 0) => {
    return items.map((item, index) => (
      <div key={`${item.name}-${depth}-${index}`}>
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1 hover:bg-background-tertiary rounded cursor-pointer transition-colors",
            currentFile === item.name && "bg-primary/10 text-primary",
            "text-sm"
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (item.type === 'file') {
              setCurrentFile(item.name);
            }
          }}
        >
          {item.type === 'folder' ? (
            <>
              {item.isOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              <Folder className="w-4 h-4 text-muted-foreground" />
            </>
          ) : (
            <FileText className="w-4 h-4 text-muted-foreground ml-3" />
          )}
          <span className="truncate">{item.name}</span>
        </div>
        
        {item.type === 'folder' && item.isOpen && item.children && (
          <div>
            {renderFileTree(item.children, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className={cn("h-full flex", className)}>
      {/* File Explorer */}
      <div className="w-64 bg-background-secondary border-r border-border flex flex-col">
        <div className="p-3 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">Files</h3>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {renderFileTree(fileTree)}
          </div>
        </ScrollArea>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-background-secondary">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">{currentFile}</span>
            {isStreaming && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Generating...
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="typescript"
            value={code}
            onChange={(value) => setCode(value || '')}
            theme="vs-dark"
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              lineNumbers: 'on',
              glyphMargin: false,
              folding: true,
              lineDecorationsWidth: 0,
              lineNumbersMinChars: 3,
              renderLineHighlight: 'none',
              automaticLayout: true
            }}
          />
        </div>
      </div>
    </div>
  );
};
