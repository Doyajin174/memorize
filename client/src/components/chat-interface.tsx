import { useState, useRef, useEffect } from "react";
import { Brain, User, X, Send, Lightbulb, Calendar, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useChat } from "@/hooks/use-chat";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
  analysis?: {
    title: string;
    category: string;
    tags: string[];
    structuredData: Record<string, any>;
  };
}

export default function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I'm here to help you store and organize any information. Just tell me what you'd like to remember!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { analyzeContent, isAnalyzing } = useChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim() || isAnalyzing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const result = await analyzeContent(inputValue);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Perfect! I've stored your ${result.analysis.category.toLowerCase()} information:`,
        timestamp: new Date(),
        analysis: result.analysis,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Sorry, I encountered an error while processing your memory. Please try again.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 96) + "px";
  };

  const quickSuggestions = [
    { icon: Lightbulb, text: "💡 Save an idea", prompt: "I have an idea: " },
    { icon: Calendar, text: "📅 Add schedule", prompt: "I need to remember: " },
    { icon: UserPlus, text: "👤 Store contact", prompt: "Contact information: " },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-end p-6">
      <div className="w-96 h-2/3 bg-white rounded-t-2xl shadow-2xl flex flex-col chat-slide-up">
        {/* Header */}
        <div className="p-4 border-b notion-border-200 rounded-t-2xl gradient-blue-purple">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">AI Memory Assistant</h3>
                <p className="text-xs text-white text-opacity-70">Ready to help you organize</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start space-x-3",
                message.type === "user" ? "justify-end" : ""
              )}
            >
              {message.type === "ai" && (
                <div className="w-8 h-8 gradient-blue-purple rounded-full flex items-center justify-center flex-shrink-0">
                  <Brain className="h-4 w-4 text-white" />
                </div>
              )}
              
              <div className={cn(
                "rounded-2xl p-3 max-w-xs",
                message.type === "ai" 
                  ? "notion-bg-100 rounded-tl-md" 
                  : "bg-accent-blue text-white rounded-tr-md"
              )}>
                <p className={cn(
                  "text-sm",
                  message.type === "ai" ? "notion-text-800" : "text-white"
                )}>
                  {message.content}
                </p>
                
                {message.analysis && (
                  <div className="mt-2 p-2 bg-white rounded-lg border notion-border-200">
                    <div className="text-xs notion-text-600 mb-1">
                      📝 {message.analysis.category}
                    </div>
                    <div className="text-sm font-medium notion-text-800">
                      {message.analysis.title}
                    </div>
                    {Object.keys(message.analysis.structuredData).length > 0 && (
                      <div className="mt-1 space-y-1">
                        {Object.entries(message.analysis.structuredData).map(([key, value]) => (
                          <div key={key} className="text-xs notion-text-600">
                            {key}: {String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.analysis.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {message.type === "user" && (
                <div className="w-8 h-8 notion-bg-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 gradient-blue-purple rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <div className="notion-bg-100 rounded-2xl rounded-tl-md p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-notion-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-notion-400 rounded-full typing-dot"></div>
                  <div className="w-2 h-2 bg-notion-400 rounded-full typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t notion-border-200">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                rows={1}
                placeholder="Tell me what you'd like to remember..."
                className="resize-none auto-resize border notion-border-200 focus:ring-2 focus:ring-blue-500"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  autoResize(e);
                }}
                onKeyDown={handleKeyDown}
                disabled={isAnalyzing}
              />
            </div>
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isAnalyzing}
              className="bg-accent-blue hover:bg-blue-700 text-white rounded-2xl"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="text-xs notion-bg-100 notion-text-700 hover:notion-bg-200 rounded-full"
                onClick={() => setInputValue(suggestion.prompt)}
              >
                {suggestion.text}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
