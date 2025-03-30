import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import ScrumEventSelector from "./ScrumEventSelector";
import SimulationInfo from "./SimulationInfo";
import ChatInterface from "./ChatInterface";
import ScenarioSelector from "./ScenarioSelector";
import { ScrumEventType } from "../../lib/types";
import { queryClient } from "../../lib/queryClient";
import { resetEventMessages as resetEventMessagesApi } from "../../lib/api";

const SimulatorTab = () => {
  const [selectedEvent, setSelectedEvent] = useState<ScrumEventType>("planning");
  
  // Define a mutation to reset messages when event changes
  const { mutate: resetEventMessages } = useMutation({
    mutationFn: async (eventType: ScrumEventType) => {
      return resetEventMessagesApi(eventType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/messages', selectedEvent] });
    }
  });
  
  // Reset messages when event changes
  useEffect(() => {
    resetEventMessages(selectedEvent);
  }, [selectedEvent, resetEventMessages]);

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-1 mb-4 bg-primary/10 rounded-full dark:bg-primary/20">
          <span className="px-3 py-1 text-xs font-medium text-primary rounded-full">
            AI-Powered Practice
          </span>
        </div>
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
          Scrum Event Simulator
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
          Master facilitation by practicing with an AI coach that responds like a real team. Handle challenges at the moment they matter.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 overflow-hidden dark:bg-gray-800/50 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 space-y-5 dark:border-gray-700">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center dark:text-white">
                <i className="ri-calendar-event-line mr-2 text-primary"></i>
                Select Scrum Event
              </h3>
              <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
                Choose which Scrum event you want to practice facilitating:
              </p>
              
              <ScrumEventSelector 
                selectedEvent={selectedEvent} 
                setSelectedEvent={setSelectedEvent} 
              />
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-transparent p-5 rounded-xl dark:from-primary/20">
              <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center dark:text-white">
                <i className="ri-award-line mr-2 text-primary"></i>
                Why Use the Simulator?
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <i className="ri-check-line text-green-500 mt-1 mr-2"></i>
                  <span>Practice facilitating all Scrum events with realistic team responses</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-500 mt-1 mr-2"></i>
                  <span>Learn to handle difficult scenarios and team dynamics</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-500 mt-1 mr-2"></i>
                  <span>Get coaching aligned with Scrum Guide principles</span>
                </li>
                <li className="flex items-start">
                  <i className="ri-check-line text-green-500 mt-1 mr-2"></i>
                  <span>Build confidence in a risk-free environment</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-800 mb-3 flex items-center dark:text-white">
              <i className="ri-file-list-3-line mr-2 text-primary"></i>
              Select Scenario Challenge
            </h3>
            <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
              Choose a scenario to practice, from beginner to advanced challenges:
            </p>
            
            <ScenarioSelector selectedEvent={selectedEvent} />
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <SimulationInfo selectedEvent={selectedEvent} />
        </div>
        
        <ChatInterface selectedEvent={selectedEvent} />
      </div>
    </div>
  );
};

export default SimulatorTab;
