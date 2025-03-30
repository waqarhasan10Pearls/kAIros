import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateIcebreaker } from "../../lib/api";
import { VibeType } from "../../lib/types";
import { useToast } from "../../hooks/use-toast";

interface CirclePromptProps {
  selectedVibe: VibeType;
}

const CirclePrompt = ({ selectedVibe }: CirclePromptProps) => {
  const [question, setQuestion] = useState<string>("If you could have dinner with any historical figure, who would it be and what would you ask them?");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const { mutate, isPending, error } = useMutation({
    mutationFn: (vibe: VibeType) => generateIcebreaker(vibe),
    onSuccess: (data) => {
      setQuestion(data.question);
    },
  });

  // Generate a new question when the vibe changes
  useEffect(() => {
    if (selectedVibe) {
      mutate(selectedVibe);
    }
  }, [selectedVibe, mutate]);

  const handleGenerate = () => {
    mutate(selectedVibe);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(question);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard!",
      description: "The question has been copied to your clipboard.",
      duration: 3000,
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center bg-gradient-to-br from-primary/90 to-primary text-white shadow-lg mb-8 p-8 text-center overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-full transform rotate-45 opacity-50"></div>
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        
        {/* Question or loading state */}
        {!isPending ? (
          <>
            <div className="font-medium text-lg z-10 transition-all duration-300 group-hover:scale-105">{question}</div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-full"></div>
          </>
        ) : (
          <div className="absolute inset-0 rounded-full flex flex-col items-center justify-center bg-primary text-white">
            <svg className="animate-spin h-12 w-12 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm animate-pulse">Creating your {selectedVibe} question...</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 flex items-center shadow-sm border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30">
          <i className="ri-error-warning-line mr-2 text-xl"></i>
          <div>
            <h4 className="font-medium">Error Generating Question</h4>
            <p className="text-sm">{error instanceof Error ? error.message : "Error connecting to API. Please try again."}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <button
          className="px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-md hover:shadow-lg hover:bg-primary/90 transition-all flex items-center disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleGenerate}
          disabled={isPending}
        >
          <i className={`${isPending ? "ri-loader-4-line animate-spin" : "ri-refresh-line"} mr-2 text-lg`}></i> 
          {isPending ? "Generating..." : "New Question"}
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all flex items-center ${
            copied 
              ? "bg-green-500 text-white" 
              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          }`}
          onClick={handleCopy}
        >
          <i className={`${copied ? "ri-check-line" : "ri-clipboard-line"} mr-2 text-lg`}></i>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Tip: Use these questions at the start of team meetings to build connection and trust</p>
      </div>
    </div>
  );
};

export default CirclePrompt;
