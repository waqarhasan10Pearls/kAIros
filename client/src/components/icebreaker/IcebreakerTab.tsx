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
    <div className="p-6 space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-1 mb-4 bg-primary/10 rounded-full dark:bg-primary/20">
          <span className="px-3 py-1 text-xs font-medium text-primary rounded-full">
            Facilitation Tools
          </span>
        </div>
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
          Team Engagement Tools
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
          Spark meaningful conversations and build stronger connections with AI-generated icebreakers and team activities designed for the opportune moment.
        </p>
      </div>

      <VibeSelector selectedVibe={selectedVibe} setSelectedVibe={setSelectedVibe} />
      
      <Tabs 
        value={activeTab} 
        onValueChange={(value) => setActiveTab(value as "questions" | "activities")}
        className="w-full max-w-3xl mx-auto"
      >
        <TabsList className="grid grid-cols-2 mb-8 w-[400px] max-w-full mx-auto">
          <TabsTrigger value="questions" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <i className="ri-question-line text-lg"></i>
            <span>Circle Questions</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
            <i className="ri-group-line text-lg"></i>
            <span>Team Activities</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="questions" className="border p-6 rounded-xl shadow-sm border-gray-100 dark:border-gray-700 transition-all duration-300">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              <i className="ri-chat-smile-3-line mr-2 text-primary"></i>
              Circle Questions for Team Building
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Use these questions to start meetings, create connection, and build psychological safety
            </p>
          </div>
          <CirclePrompt selectedVibe={selectedVibe} />
        </TabsContent>
        
        <TabsContent value="activities" className="border p-6 rounded-xl shadow-sm border-gray-100 dark:border-gray-700 transition-all duration-300">
          <div className="mb-4 text-center">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
              <i className="ri-team-fill mr-2 text-primary"></i>
              Team Activities with Clear Instructions
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Practical activities with step-by-step instructions to energize and connect your team
            </p>
          </div>
          <ActivityDisplay selectedVibe={selectedVibe} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IcebreakerTab;
