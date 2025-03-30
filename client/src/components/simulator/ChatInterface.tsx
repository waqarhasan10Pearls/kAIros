import { useState, useRef, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../../lib/api";
import { Message, ScrumEventType } from "../../lib/types";
import { queryClient } from "../../lib/queryClient";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { useToast } from "../../hooks/use-toast";

interface ChatInterfaceProps {
  selectedEvent: ScrumEventType;
}

const ChatInterface = ({ selectedEvent }: ChatInterfaceProps) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/messages', selectedEvent],
    queryFn: () => getMessages(selectedEvent),
    enabled: !!selectedEvent,
    // Ensure we get fresh data
    refetchInterval: 3000,
    staleTime: 0,
  });
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (chatContainerRef.current && messages.length > 0) {
      const container = chatContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: (content: string) => sendMessage(selectedEvent, content),
    onSuccess: () => {
      // Invalidate and refetch to update the messages
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedEvent] });
    },
    onError: (error) => {
      console.error("Message sending error:", error);
      toast({
        title: "Message not sent",
        description: error instanceof Error ? error.message : "An error occurred when sending your message",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;
    
    mutate(currentMessage);
    setCurrentMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800">
      {/* Chat header */}
      <div className="mb-4 pb-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Team conversation in progress</span>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Practice your facilitation skills as a Scrum Master
        </div>
      </div>
      
      {/* Chat messages container */}
      <div 
        ref={chatContainerRef} 
        className="h-[400px] overflow-y-auto mb-4 space-y-4 px-2 py-4 border border-gray-100 rounded-lg bg-gray-50 dark:bg-gray-900/50 dark:border-gray-700"
      >
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce delay-75"></div>
                <div className="w-3 h-3 bg-primary/60 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Loading conversation...</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {messages.map((message: Message, index: number) => (
              <div 
                key={index} 
                className={`flex items-start ${message.type === 'user' ? 'justify-end' : ''} max-w-[95%] sm:max-w-[85%] ${message.type === 'user' ? 'ml-auto' : 'mr-auto'}`}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 dark:bg-blue-900/30 dark:text-blue-400 ring-2 ring-white dark:ring-gray-800">
                    <i className="ri-team-line"></i>
                  </div>
                )}
                
                <div 
                  className={`
                    relative px-4 py-3 rounded-lg shadow-sm max-w-full
                    ${message.type === 'user' 
                      ? 'bg-primary text-white rounded-tr-none dark:bg-primary' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
                    }
                  `}
                >
                  {/* Message sender label */}
                  <div className={`text-xs font-medium mb-1 ${message.type === 'user' ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'}`}>
                    {message.type === 'user' ? 'You (Scrum Master)' : 'Team Member'}
                  </div>
                  
                  {/* Message content */}
                  <div className="prose-sm prose-p:my-1">
                    {message.type === 'ai' && message.content.includes('\n') ? (
                      <div className="whitespace-pre-line">
                        {message.content.split('\n').map((line, i) => {
                          if (line.startsWith('- ')) {
                            return (
                              <div key={i} className="flex items-baseline space-x-2 my-1">
                                <span>•</span>
                                <span>{line.substring(2)}</span>
                              </div>
                            );
                          } else if (/^\d+\.\s/.test(line.trim())) {
                            const [num, ...rest] = line.trim().split(/\.\s/);
                            return (
                              <div key={i} className="flex items-baseline space-x-2 my-1">
                                <span className="font-medium">{num}.</span>
                                <span>{rest.join('. ')}</span>
                              </div>
                            );
                          } else if (line.trim() === '') {
                            return <div key={i} className="h-2"></div>;
                          } else {
                            return <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>;
                          }
                        })}
                      </div>
                    ) : (
                      <p>{message.content}</p>
                    )}
                  </div>
                  
                  {/* Message timestamp */}
                  <div className="mt-1 text-right">
                    <span className={`text-[10px] ${message.type === 'user' ? 'text-white/70' : 'text-gray-400 dark:text-gray-500'}`}>
                      {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
                
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white ml-2 ring-2 ring-white dark:ring-gray-800">
                    <i className="ri-user-line"></i>
                  </div>
                )}
              </div>
            ))}
            
            {isPending && (
              <div className="flex items-start max-w-[95%] sm:max-w-[85%]">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2 dark:bg-blue-900/30 dark:text-blue-400 ring-2 ring-white dark:ring-gray-800">
                  <i className="ri-team-line"></i>
                </div>
                <div className="bg-white text-gray-800 rounded-lg rounded-tl-none px-4 py-3 shadow-sm border border-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-700 font-medium mb-1 dark:text-gray-300">
                    Team Member
                  </div>
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce dark:bg-gray-500"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75 dark:bg-gray-500"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150 dark:bg-gray-500"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {messages.length === 0 && !messagesLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="bg-primary/10 p-3 rounded-full text-primary text-xl mb-4 dark:bg-primary/20">
              <i className="ri-chat-smile-3-line"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2 dark:text-white">Begin Your Scrum Master Practice</h3>
            <p className="text-gray-500 max-w-md mb-4 dark:text-gray-400">
              Type a message to start the conversation with your team. Practice your facilitation skills in this {selectedEvent} session.
            </p>
            <div className="text-sm text-primary">
              <i className="ri-arrow-down-line animate-bounce"></i>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 flex items-center shadow-sm border border-red-200 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/30">
          <i className="ri-error-warning-line text-lg mr-3"></i>
          <div className="flex-1">
            <h4 className="font-medium">Message not sent</h4>
            <p className="text-sm">{error instanceof Error ? error.message : "Error connecting to AI service. Please try again."}</p>
          </div>
          <Button 
            variant="outline"
            size="sm"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedEvent] })}
            className="ml-2 text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 border-red-200 dark:border-red-900/30"
          >
            <i className="ri-refresh-line mr-1"></i> Retry
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Textarea
          className="min-h-[80px] focus-visible:ring-primary border-gray-200 resize-none rounded-lg dark:border-gray-700"
          placeholder="As the Scrum Master, what would you say or ask..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-gray-500 dark:text-gray-400 order-2 sm:order-1">
            <i className="ri-information-line mr-1"></i>
            Press <kbd className="px-1 py-0.5 border border-gray-200 rounded text-xs font-mono dark:border-gray-700">Enter</kbd> to send
          </p>
          
          <Button 
            className="gap-2 py-3 px-4 sm:py-4 sm:px-6 w-full sm:w-auto order-1 sm:order-2"
            onClick={handleSendMessage}
            disabled={isPending || !currentMessage.trim()}
          >
            <span>{isPending ? "Sending..." : "Send"}</span>
            <i className={`${isPending ? "ri-loader-4-line animate-spin" : "ri-send-plane-fill"}`}></i>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
