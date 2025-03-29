import { ScrumEventType } from "@/lib/types";

interface ScrumEventSelectorProps {
  selectedEvent: ScrumEventType;
  setSelectedEvent: (event: ScrumEventType) => void;
}

const ScrumEventSelector = ({ selectedEvent, setSelectedEvent }: ScrumEventSelectorProps) => {
  const events = [
    { 
      type: "daily" as ScrumEventType, 
      title: "Daily Scrum", 
      description: "15-minute time-boxed event" 
    },
    { 
      type: "planning" as ScrumEventType, 
      title: "Sprint Planning", 
      description: "Decide what can be delivered" 
    },
    { 
      type: "review" as ScrumEventType, 
      title: "Sprint Review", 
      description: "Inspect the increment" 
    },
    { 
      type: "retro" as ScrumEventType, 
      title: "Sprint Retrospective", 
      description: "Plan for improvements" 
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
            <h3 className={`font-medium ${selectedEvent === event.type ? "text-primary" : ""}`}>{event.title}</h3>
            <p className="text-xs text-gray-500">{event.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ScrumEventSelector;
