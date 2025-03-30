import { useState } from "react";
import ScrumEventSelector from "./ScrumEventSelector";
import SimulationInfo from "./SimulationInfo";
import ChatInterface from "./ChatInterface";
import ScenarioSelector from "./ScenarioSelector";
import { ScrumEventType } from "../../lib/types";

const SimulatorTab = () => {
  const [selectedEvent, setSelectedEvent] = useState<ScrumEventType>("planning");

  return (
    <div>
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">kAIros Scrum Simulator</h2>
        <div className="space-y-4">
          <p className="text-gray-600">Master the art of Scrum facilitation with our AI-powered coaching platform. kAIros helps Scrum Masters practice and refine their skills through interactive simulations of key Scrum events.</p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Why use kAIros?</h3>
            <ul className="list-disc list-inside text-blue-800 space-y-1">
              <li>Practice facilitating Daily Scrums, Planning, Reviews, and Retrospectives</li>
              <li>Receive real-time feedback from our AI coach</li>
              <li>Learn to handle challenging scenarios and team dynamics</li>
              <li>Improve your skills in a risk-free environment</li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-500">Select a Scrum event below to begin your simulation:</p>
        </div>
        
        <ScrumEventSelector 
          selectedEvent={selectedEvent} 
          setSelectedEvent={setSelectedEvent} 
        />
        
        <ScenarioSelector selectedEvent={selectedEvent} />
      </div>

      <SimulationInfo selectedEvent={selectedEvent} />
      <ChatInterface selectedEvent={selectedEvent} />
    </div>
  );
};

export default SimulatorTab;
