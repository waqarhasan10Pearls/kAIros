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
      description: "Inspect progress toward the Sprint Goal",
      icon: "ri-time-line"
    },
    { 
      type: "planning" as ScrumEventType, 
      title: "Sprint Planning", 
      description: "Lay out the work to be performed in the Sprint",
      icon: "ri-calendar-check-line"
    },
    { 
      type: "review" as ScrumEventType, 
      title: "Sprint Review", 
      description: "Inspect the outcome of the Sprint",
      icon: "ri-presentation-line"
    },
    { 
      type: "retro" as ScrumEventType, 
      title: "Sprint Retrospective", 
      description: "Plan ways to increase quality and effectiveness",
      icon: "ri-loop-left-line"
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {events.map((event) => (
        <button
          key={event.type}
          className={`group relative p-3 rounded-lg text-left transition-all duration-200 ${
            selectedEvent === event.type 
              ? "bg-gradient-to-br from-primary/20 to-primary/5 ring-2 ring-primary/30 ring-offset-2 shadow-md dark:bg-gradient-to-br dark:from-primary/30 dark:to-primary/10 dark:ring-primary/40 dark:ring-offset-gray-800" 
              : "bg-white border border-gray-200 hover:border-primary/30 hover:bg-primary/5 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-primary/40 dark:hover:bg-primary/10"
          }`}
          onClick={() => setSelectedEvent(event.type)}
        >
          <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
            selectedEvent === event.type 
              ? "bg-primary text-white" 
              : "bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary/80 dark:bg-gray-700 dark:text-gray-400"
          }`}>
            <i className={`${event.icon} text-xs`}></i>
          </div>
          
          <h3 className={`text-base font-semibold mb-1 ${
            selectedEvent === event.type 
              ? "text-primary" 
              : "text-gray-800 group-hover:text-primary/80 dark:text-gray-200"
          }`}>
            {event.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{event.description}</p>
          
          {selectedEvent === event.type && (
            <div className="mt-2 text-xs font-medium text-primary">
              <i className="ri-check-double-line mr-1"></i> Selected
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ScrumEventSelector;
