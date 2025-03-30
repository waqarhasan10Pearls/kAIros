import { useState } from 'react';
import { IcebreakerActivity, VibeType } from '../../lib/types';
import { generateActivity as generateActivityApi } from '../../lib/api';

interface ActivityDisplayProps {
  selectedVibe: VibeType;
}

const ActivityDisplay = ({ selectedVibe }: ActivityDisplayProps) => {
  const [activity, setActivity] = useState<IcebreakerActivity | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateActivity = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await generateActivityApi(selectedVibe);
      setActivity(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error generating activity:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 p-4">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Team Activities</h2>
        <button
          onClick={generateActivity}
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <i className="ri-loader-4-line animate-spin"></i>
              Generating...
            </>
          ) : (
            <>
              <i className="ri-group-line"></i>
              Generate Activity
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 text-red-700 rounded-md">
          <p className="flex items-center gap-2">
            <i className="ri-error-warning-line"></i>
            {error}
          </p>
        </div>
      )}

      {activity && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-primary/10 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-800">{activity.title}</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <i className="ri-time-line mr-1"></i>
                {activity.duration}
              </span>
            </div>
            <p className="mt-1 text-gray-600">{activity.description}</p>
          </div>
          <div className="px-6 py-4">
            <h4 className="text-md font-medium text-gray-700 mb-3">Instructions:</h4>
            <ol className="list-decimal pl-6 space-y-2">
              {activity.instructions.map((instruction, index) => (
                <li key={index} className="text-gray-600">{instruction}</li>
              ))}
            </ol>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <p className="text-sm text-gray-500 flex items-center">
              <i className="ri-information-line mr-1"></i>
              Remember to adapt this activity based on your team's context and preferences.
            </p>
          </div>
        </div>
      )}

      {!activity && !isLoading && !error && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <i className="ri-group-line text-4xl text-gray-400 mb-3 block"></i>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No activity generated yet</h3>
          <p className="text-gray-500 mb-4">
            Click the button above to generate a {selectedVibe} team activity that you can use with your Scrum team.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivityDisplay;