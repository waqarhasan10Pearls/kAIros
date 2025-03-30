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
    <div className="flex flex-wrap gap-4">
      {events.map((event) => (
        <button
          key={event.type}
          className={`w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)] h-[200px] p-4 rounded-lg text-left transition-all duration-200 flex flex-col ${
            selectedEvent === event.type 
              ? "bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/30 shadow-md dark:bg-gradient-to-br dark:from-primary/30 dark:to-primary/10 dark:ring-primary/40" 
              : "bg-white border border-gray-200 hover:border-primary/30 hover:bg-primary/5 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-primary/40 dark:hover:bg-primary/10"
          }`}
          onClick={() => setSelectedEvent(event.type)}
        >
          {/* Icon */}
          <div className="flex mb-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedEvent === event.type 
                ? "bg-primary text-white" 
                : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary/80 dark:bg-gray-700 dark:text-gray-400"
            }`}>
              <i className={`${event.icon} text-lg`}></i>
            </div>
          </div>
          
          {/* Title */}
          <h3 className={`text-lg font-semibold mb-2 ${
            selectedEvent === event.type 
              ? "text-primary" 
              : "text-gray-800 group-hover:text-primary/80 dark:text-gray-200"
          }`}>
            {event.title}
            {selectedEvent === event.type && (
              <span className="ml-2 text-xs font-medium text-primary inline-flex items-center">
                <i className="ri-check-line mr-1"></i> Selected
              </span>
            )}
          </h3>
          
          {/* Description */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {event.description}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ScrumEventSelector;
