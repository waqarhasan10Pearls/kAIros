import { useState } from "react";
import VibeSelector from "./VibeSelector";
import CirclePrompt from "./CirclePrompt";
import { VibeType } from "../../lib/types";

const IcebreakerTab = () => {
  const [selectedVibe, setSelectedVibe] = useState<VibeType>("random");

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Icebreaker Questions</h2>
        <p className="text-gray-600">Generate insightful icebreaker questions for your team!</p>
      </div>

      <VibeSelector selectedVibe={selectedVibe} setSelectedVibe={setSelectedVibe} />
      <CirclePrompt selectedVibe={selectedVibe} />
    </div>
  );
};

export default IcebreakerTab;
