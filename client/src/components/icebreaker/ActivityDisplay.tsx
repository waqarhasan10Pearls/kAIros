import { useState, useEffect } from 'react';
import { IcebreakerActivity, VibeType } from '../../lib/types';
import { generateActivity as generateActivityApi } from '../../lib/api';
import { useToast } from '../../hooks/use-toast';

interface ActivityDisplayProps {
  selectedVibe: VibeType;
}

const ActivityDisplay = ({ selectedVibe }: ActivityDisplayProps) => {
  const [activity, setActivity] = useState<IcebreakerActivity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Generate a new activity when the vibe changes
  useEffect(() => {
    if (selectedVibe) {
      generateActivityWithTimestamp();
    }
  }, [selectedVibe]);

  // Add timestamp to ensure we get fresh content
  const generateActivityWithTimestamp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Add cache-busting timestamp
      const timestamp = new Date().getTime();
      const data = await generateActivityApi(selectedVibe, timestamp);
      setActivity(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error generating activity:', err);
      
      toast({
        title: "Error generating activity",
        description: err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // For compatibility with existing code
  const generateActivity = generateActivityWithTimestamp;

  const handleCopyActivity = () => {
    if (!activity) return;
    
    const activityText = `
Activity: ${activity.title}
Duration: ${activity.duration}

Description:
${activity.description}

Instructions:
${activity.instructions.map((instruction, index) => {
  const cleanInstruction = instruction.replace(/^\d+\.\s*/, '');
  return `${index + 1}. ${cleanInstruction}`;
}).join('\n')}
`;
    
    navigator.clipboard.writeText(activityText);
    
    toast({
      title: "Activity copied!",
      description: "The activity has been copied to your clipboard.",
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 justify-center">
        <button
          onClick={generateActivity}
          disabled={isLoading}
          className="px-6 py-3 bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <i className="ri-loader-4-line animate-spin text-lg"></i>
              Generating {selectedVibe} Activity...
            </>
          ) : (
            <>
              <i className="ri-team-fill text-lg"></i>
              Generate New Activity
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-5 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm dark:bg-red-900/10 dark:border-red-900/20 dark:text-red-400">
          <div className="flex items-start gap-3">
            <i className="ri-error-warning-line text-xl mt-0.5"></i>
            <div>
              <h4 className="font-medium mb-1">Error Generating Activity</h4>
              <p className="text-sm">{error}</p>
              <button 
                onClick={generateActivity}
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {activity && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-6 py-5 border-b border-gray-200 dark:from-primary/30 dark:to-primary/10 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
                <i className="ri-team-fill mr-2 text-primary"></i>
                {activity.title}
              </h3>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-white/80 text-gray-700 shadow-sm dark:bg-gray-700 dark:text-gray-200">
                <i className="ri-time-line mr-1.5"></i>
                {activity.duration}
              </span>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{activity.description}</p>
          </div>
          
          <div className="px-6 py-5">
            <h4 className="text-md font-medium text-gray-800 mb-4 flex items-center dark:text-white">
              <i className="ri-list-check mr-2 text-primary"></i>
              Step-by-Step Instructions:
            </h4>
            <ol className="list-decimal pl-6 space-y-3">
              {activity.instructions.map((instruction, index) => {
                // Remove any leading numbers (like "1. " or "1.") from the instruction
                const cleanInstruction = instruction.replace(/^\d+\.\s*/, '');
                return (
                  <li key={index} className="text-gray-600 dark:text-gray-300 pb-2 font-medium">
                    {cleanInstruction}
                  </li>
                );
              })}
            </ol>
            
            <div className="mt-5 flex justify-center">
              <button
                onClick={handleCopyActivity}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/5 transition-colors dark:border-primary/50 dark:hover:bg-primary/10"
              >
                <i className="ri-clipboard-line"></i>
                Copy All Instructions
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-sm text-gray-500 flex items-center dark:text-gray-400">
                <i className="ri-information-line mr-1.5"></i>
                Adapt this activity based on your team's context and preferences.
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                Generated for {selectedVibe} vibe
              </span>
            </div>
          </div>
        </div>
      )}

      {!activity && !isLoading && !error && (
        <div className="bg-white/80 border border-gray-200 rounded-xl p-8 text-center shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
          <div className="p-4 bg-primary/10 inline-flex rounded-full mb-4 text-primary dark:bg-primary/20">
            <i className="ri-group-line text-4xl"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-800 mb-3 dark:text-white">Ready for an engaging team activity?</h3>
          <p className="text-gray-500 mb-5 max-w-md mx-auto dark:text-gray-400">
            Generate a {selectedVibe} team activity with clear instructions that you can use in your next Scrum event.
          </p>
          <button
            onClick={generateActivity}
            className="px-5 py-2.5 bg-primary text-white rounded-lg shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2 mx-auto"
          >
            <i className="ri-magic-line"></i>
            Generate {selectedVibe} Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityDisplay;