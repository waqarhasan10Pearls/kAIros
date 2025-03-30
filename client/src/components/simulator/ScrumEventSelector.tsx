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

  // Simple table-based layout for reliability
  return (
    <div className="w-full overflow-hidden rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <table className="w-full table-fixed border-collapse">
        <tbody>
          {events.map((event) => (
            <tr 
              key={event.type}
              onClick={() => setSelectedEvent(event.type)}
              className={`border-b last:border-b-0 border-gray-200 dark:border-gray-700 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                selectedEvent === event.type ? "bg-primary/10 dark:bg-primary/20" : ""
              }`}
            >
              <td className="w-2/5 p-4 text-center align-middle">
                <div className="flex flex-col justify-center">
                  <div className={`inline-flex flex-col items-center justify-center ${
                    selectedEvent === event.type ? "text-primary font-semibold" : "text-gray-700 dark:text-gray-300"
                  }`}>
                    <span className="text-base md:text-lg">{event.title}</span>
                    {selectedEvent === event.type && (
                      <span className="mt-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Selected
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td className="w-3/5 p-4 border-l border-gray-200 dark:border-gray-700 align-middle">
                <div className="text-sm text-gray-600 dark:text-gray-400 max-w-full break-words">
                  {event.description}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScrumEventSelector;
