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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Scrum Simulator</h2>
        <p className="text-gray-600">Practice your Scrum Master skills with AI-powered simulations.</p>
        
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
