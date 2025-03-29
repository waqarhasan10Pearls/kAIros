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
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded mt-2"></div>
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

  const eventTimeboxes = {
    daily: "15 minutes",
    planning: "8 hours for a 1-month Sprint",
    review: "4 hours for a 1-month Sprint",
    retro: "3 hours for a 1-month Sprint"
  };

  const scrumRoles = {
    "Product Owner": "primary-blue",
    "Scrum Master": "primary-green",
    "Developer": "primary-orange"
  };

  return (
    <div className="p-6 bg-gray-50 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h3 className="font-bold">{eventTitles[selectedEvent]}</h3>
        <Badge variant="outline" className="mt-2 sm:mt-0">Timebox: {eventTimeboxes[selectedEvent]}</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Scrum Team</h4>
          <ul className="text-sm text-gray-600 mt-1 space-y-1">
            {data.teamMembers.map((member: {name: string, role: string, status: string}, index: number) => (
              <li key={index} className="flex items-center">
                <span className={`h-2 w-2 rounded-full ${member.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></span>
                {member.name} <span className="text-xs ml-1">({member.role})</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700">Sprint Information</h4>
          <ul className="text-sm text-gray-600 mt-1 space-y-1">
            <li>Current Sprint: #{data.sprintDetails.number}</li>
            <li>Sprint Duration: {data.sprintDetails.duration}</li>
            <li>Previous Velocity: {data.sprintDetails.previousVelocity} points</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700">Your Role: Scrum Master</h4>
          <p className="text-sm text-gray-600 mt-1 max-h-24 overflow-y-auto pr-2">
            {data.roleDescription}
          </p>
        </div>
      </div>

      {/* Display active scenario information if available */}
      {data.scenarioType && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <h4 className="text-sm font-medium text-gray-700 mr-2">Active Scenario:</h4>
            <Badge 
              variant={data.scenarioType === 'predefined' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {data.scenarioType === 'predefined' ? 'Predefined' : 'Custom'}
            </Badge>
          </div>
          
          {data.scenarioType === 'predefined' && data.scenarioChallenge && (
            <div className="mt-2">
              <h5 className="text-sm font-semibold">{data.scenarioChallenge.title}</h5>
              <Badge variant="outline" className="mt-1 mb-2 text-xs">
                Difficulty: {data.scenarioChallenge.difficulty}
              </Badge>
              <p className="text-sm text-gray-600">{data.scenarioChallenge.description}</p>
            </div>
          )}
          
          {data.scenarioType === 'custom' && data.customScenario && (
            <div className="mt-2">
              <h5 className="text-sm font-semibold">Custom Scenario</h5>
              <p className="text-sm text-gray-600 mt-1">{data.customScenario}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimulationInfo;
