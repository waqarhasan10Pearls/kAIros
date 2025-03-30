import { ScrumEventType } from "../../lib/types";

interface ScrumEventSelectorProps {
  selectedEvent: ScrumEventType;
  setSelectedEvent: (event: ScrumEventType) => void;
}

const ScrumEventSelector = ({ selectedEvent, setSelectedEvent }: ScrumEventSelectorProps) => {
  const events = [
    { 
      type: "daily" as ScrumEventType, 
      title: "Daily Scrum", 
      description: "Inspect progress toward the Sprint Goal" 
    },
    { 
      type: "planning" as ScrumEventType, 
      title: "Sprint Planning", 
      description: "Lay out the work to be performed in the Sprint" 
    },
    { 
      type: "review" as ScrumEventType, 
      title: "Sprint Review", 
      description: "Inspect the outcome of the Sprint" 
    },
    { 
      type: "retro" as ScrumEventType, 
      title: "Sprint Retrospective", 
      description: "Plan ways to increase quality and effectiveness" 
    },
  ];

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Scrum Event:
      </label>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {events.map((event) => (
          <button
            key={event.type}
            className={`border rounded-md px-4 py-3 text-left hover:bg-gray-50 transition ${
              selectedEvent === event.type 
                ? "bg-gray-50 border-primary" 
                : "border-gray-300"
            }`}
            onClick={() => setSelectedEvent(event.type)}
          >
            <h3 className={`text-lg font-semibold mb-1 ${selectedEvent === event.type ? "text-primary" : "text-gray-800"}`}>{event.title}</h3>
            <p className="text-sm text-gray-600">{event.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScrumEventSelector;
