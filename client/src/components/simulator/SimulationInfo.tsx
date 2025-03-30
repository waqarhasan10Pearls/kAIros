import { ScrumEventType } from "../../lib/types";
import { getSimulationInfo } from "../../lib/api";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "../ui/badge";

interface SimulationInfoProps {
  selectedEvent: ScrumEventType;
}

const SimulationInfo = ({ selectedEvent }: SimulationInfoProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/simulation-info', selectedEvent],
    queryFn: () => getSimulationInfo(selectedEvent),
    enabled: !!selectedEvent
  });

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4 dark:bg-gray-700"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 dark:bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 dark:bg-gray-700"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
                <div className="h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3 dark:bg-gray-700"></div>
              <div className="h-3 bg-gray-200 rounded dark:bg-gray-700"></div>
              <div className="h-3 bg-gray-200 rounded mt-2 dark:bg-gray-700"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const eventTitles = {
    daily: "Daily Scrum",
    planning: "Sprint Planning",
    review: "Sprint Review",
    retro: "Sprint Retrospective"
  };

  const eventIcons = {
    daily: "ri-time-line",
    planning: "ri-calendar-check-line",
    review: "ri-presentation-line",
    retro: "ri-loop-left-line"
  };

  const eventTimeboxes = {
    daily: "15 minutes",
    planning: "8 hours for a 1-month Sprint",
    review: "4 hours for a 1-month Sprint",
    retro: "3 hours for a 1-month Sprint"
  };

  const roleColors = {
    "Product Owner": "text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30",
    "Scrum Master": "text-emerald-600 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-900/30",
    "Developer": "text-amber-600 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/30"
  };

  const difficultyColors = {
    "beginner": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "intermediate": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "advanced": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
  };

  return (
    <div className="p-6 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
        <div className="flex items-center">
          <div className="mr-3 p-2 bg-primary/10 rounded-full text-primary dark:bg-primary/20">
            <i className={`${eventIcons[selectedEvent]} text-lg`}></i>
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{eventTitles[selectedEvent]}</h3>
        </div>
        <Badge variant="outline" className="mt-2 sm:mt-0 py-1 px-3 font-medium border-primary/20 dark:border-primary/40">
          <i className="ri-time-line mr-1.5"></i>
          Timebox: {eventTimeboxes[selectedEvent]}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center dark:text-gray-200">
            <i className="ri-team-line mr-2 text-primary"></i>
            Scrum Team
          </h4>
          <ul className="space-y-2">
            {data.teamMembers.map((member: {name: string, role: string, status: string}, index: number) => (
              <li key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span className={`h-2.5 w-2.5 rounded-full ${member.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></span>
                  <span className="text-gray-700 dark:text-gray-300">{member.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${roleColors[member.role as keyof typeof roleColors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`}>
                  {member.role}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center dark:text-gray-200">
            <i className="ri-calendar-event-line mr-2 text-primary"></i>
            Sprint Information
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Current Sprint:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">#{data.sprintDetails.number}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Duration:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{data.sprintDetails.duration}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Previous Velocity:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{data.sprintDetails.previousVelocity} story points</span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 dark:bg-gray-800/50 dark:border-gray-700">
          <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center dark:text-gray-200">
            <i className="ri-user-star-line mr-2 text-primary"></i>
            Your Role
          </h4>
          <div className="mb-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
            Scrum Master
          </div>
          <p className="text-sm text-gray-600 mt-2 max-h-24 overflow-y-auto pr-2 dark:text-gray-300">
            {data.roleDescription}
          </p>
        </div>
      </div>

      {/* Display active scenario information if available */}
      {data.scenarioType && (
        <div className="mt-6 pt-5 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <i className="ri-file-list-3-line mr-2 text-primary"></i>
            <h4 className="text-base font-medium text-gray-800 mr-3 dark:text-white">Active Scenario:</h4>
            <Badge 
              variant={data.scenarioType === 'predefined' ? 'default' : 'secondary'}
              className="px-2.5 py-0.5 text-xs font-medium"
            >
              {data.scenarioType === 'predefined' ? 'Predefined Challenge' : 'Custom Scenario'}
            </Badge>
          </div>
          
          {data.scenarioType === 'predefined' && data.scenarioChallenge && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-base font-semibold text-gray-800 dark:text-white">{data.scenarioChallenge.title}</h5>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyColors[data.scenarioChallenge.difficulty as keyof typeof difficultyColors]}`}>
                  {data.scenarioChallenge.difficulty.charAt(0).toUpperCase() + data.scenarioChallenge.difficulty.slice(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{data.scenarioChallenge.description}</p>
            </div>
          )}
          
          {data.scenarioType === 'custom' && data.customScenario && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
              <h5 className="text-base font-semibold text-gray-800 mb-2 dark:text-white">Custom Scenario</h5>
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                {data.customScenario}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulationInfo;
