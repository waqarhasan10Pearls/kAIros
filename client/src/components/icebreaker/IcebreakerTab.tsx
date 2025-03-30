import { useState } from "react";
import VibeSelector from "./VibeSelector";
import CirclePrompt from "./CirclePrompt";
import ActivityDisplay from "./ActivityDisplay";
import { VibeType } from "../../lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const IcebreakerTab = () => {
  const [selectedVibe, setSelectedVibe] = useState<VibeType>("random");
  const [activeTab, setActiveTab] = useState<"questions" | "activities">("questions");

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Team Engagement Tools</h2>
        <p className="text-gray-600">Generate icebreaker questions and team activities for better collaboration!</p>
      </div>

      <VibeSelector selectedVibe={selectedVibe} setSelectedVibe={setSelectedVibe} />
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "questions" | "activities")}
        className="w-full max-w-3xl mx-auto"
      >
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <i className="ri-question-line"></i>
            <span>Circle Questions</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2">
            <i className="ri-group-line"></i>
            <span>Team Activities</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions">
          <CirclePrompt selectedVibe={selectedVibe} />
        </TabsContent>
        
        <TabsContent value="activities">
          <ActivityDisplay selectedVibe={selectedVibe} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IcebreakerTab;
