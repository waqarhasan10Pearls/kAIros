import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../../lib/api";
import { Message, ScrumEventType } from "../../lib/types";
import { queryClient } from "../../lib/queryClient";

interface ChatInterfaceProps {
  selectedEvent: ScrumEventType;
}

const ChatInterface = ({ selectedEvent }: ChatInterfaceProps) => {
  const [currentMessage, setCurrentMessage] = useState("");

  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['/api/messages', selectedEvent],
    queryFn: () => getMessages(selectedEvent),
    enabled: !!selectedEvent
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (content: string) => sendMessage(selectedEvent, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedEvent] });
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
    <div className="p-6 bg-white">
      <div id="chat-container" className="h-80 overflow-y-auto mb-4 space-y-4 p-2">
        {messagesLoading ? (
          <div className="flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            {messages.map((message: Message, index: number) => (
              <div key={index} className={`flex items-start ${message.type === 'user' ? 'justify-end mb-4' : 'mb-4'}`}>
                {message.type === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-2">
                    <i className="ri-user-smile-line"></i>
                  </div>
                )}
                <div className={`chat-bubble ${message.type === 'user' ? 'chat-bubble-user bg-primary text-white' : 'chat-bubble-ai bg-gray-100 text-gray-800'} p-3 rounded-lg`}>
                  {message.type === 'ai' && message.content.includes('\n') ? (
                    <>
                      {message.content.split('\n').map((line, i) => {
                        if (line.startsWith('- ')) {
                          return <li key={i} className="ml-4">{line.substring(2)}</li>;
                        } else if (line.trim().startsWith('1.') || line.trim().startsWith('2.') || line.trim().startsWith('3.')) {
                          return <li key={i} className="ml-4">{line}</li>;
                        } else if (line.trim() === '') {
                          return <br key={i} />;
                        } else {
                          return <p key={i} className={i > 0 ? "mt-2" : ""}>{line}</p>;
                        }
                      })}
                    </>
                  ) : (
                    <p>{message.content}</p>
                  )}
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white ml-2">
                    <i className="ri-user-line"></i>
                  </div>
                )}
              </div>
            ))}
            
            {isPending && (
              <div className="flex items-center justify-center py-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          <i className="ri-error-warning-line mr-1"></i>
          <span>{error instanceof Error ? error.message : "Error connecting to AI service. Please try again."}</span>
        </div>
      )}

      <div className="flex">
        <textarea
          className="flex-grow border border-gray-300 rounded-l-md py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          rows={2}
          placeholder="Type your response as Scrum Master..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        ></textarea>
        <button 
          className="bg-primary text-white px-4 rounded-r-md hover:bg-primary/90 transition-colors flex items-center justify-center"
          onClick={handleSendMessage}
          disabled={isPending || !currentMessage.trim()}
        >
          <i className="ri-send-plane-fill"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
