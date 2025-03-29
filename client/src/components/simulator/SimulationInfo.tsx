import { ScrumEventType } from "@/lib/types";
import { getSimulationInfo } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface SimulationInfoProps {
  selectedEvent: ScrumEventType;
}

const SimulationInfo = ({ selectedEvent }: SimulationInfoProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/simulation-info', selectedEvent],
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
    daily: "Daily Scrum Session",
    planning: "Sprint Planning Session",
    review: "Sprint Review Session",
    retro: "Sprint Retrospective Session"
  };

  return (
    <div className="p-6 bg-gray-50 border-b border-gray-200">
      <h3 className="font-bold mb-2">{eventTitles[selectedEvent]}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Team Members</h4>
          <ul className="text-sm text-gray-600 mt-1 space-y-1">
            {data.teamMembers.map((member: {name: string, role: string, status: string}, index: number) => (
              <li key={index} className="flex items-center">
                <span className={`h-2 w-2 rounded-full ${member.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></span>
                {member.name} ({member.role})
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700">Sprint Details</h4>
          <ul className="text-sm text-gray-600 mt-1 space-y-1">
            <li>Sprint #{data.sprintDetails.number}</li>
            <li>Duration: {data.sprintDetails.duration}</li>
            <li>Prev. Velocity: {data.sprintDetails.previousVelocity} points</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-700">Your Role</h4>
          <p className="text-sm text-gray-600 mt-1">
            {data.roleDescription}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulationInfo;
