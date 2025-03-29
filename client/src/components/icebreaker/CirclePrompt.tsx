import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { generateIcebreaker } from "../../lib/api";
import { VibeType } from "../../lib/types";

interface CirclePromptProps {
  selectedVibe: VibeType;
}

const CirclePrompt = ({ selectedVibe }: CirclePromptProps) => {
  const [question, setQuestion] = useState<string>("If you could have dinner with any historical figure, who would it be and what would you ask them?");
  
  const { mutate, isPending, error } = useMutation({
    mutationFn: (vibe: VibeType) => generateIcebreaker(vibe),
    onSuccess: (data) => {
      setQuestion(data.question);
    },
  });

  const handleGenerate = () => {
    mutate(selectedVibe);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(question);
    // Could use toast here for feedback
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white shadow-lg mb-8 p-10 text-center">
        {!isPending ? (
          <div className="font-medium text-lg">{question}</div>
        ) : (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-primary bg-opacity-90 text-white">
            <svg className="animate-spin h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          <i className="ri-error-warning-line mr-1"></i>
          <span>{error instanceof Error ? error.message : "Error connecting to API. Please try again."}</span>
        </div>
      )}

      <div className="flex gap-3">
        <button
          className="px-6 py-2 rounded-md bg-primary text-white font-medium shadow hover:shadow-md hover:bg-primary/90 transition-all flex items-center"
          onClick={handleGenerate}
          disabled={isPending}
        >
          <i className="ri-refresh-line mr-1"></i> 
          Generate
        </button>
        <button
          className="px-6 py-2 rounded-md bg-gray-100 text-gray-700 font-medium shadow hover:shadow-md hover:bg-gray-200 transition-all flex items-center"
          onClick={handleCopy}
        >
          <i className="ri-clipboard-line mr-1"></i>
          Copy
        </button>
      </div>
    </div>
  );
};

export default CirclePrompt;
