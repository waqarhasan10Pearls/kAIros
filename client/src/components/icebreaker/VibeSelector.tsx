import { VibeType } from "../../lib/types";

interface VibeSelectorProps {
  selectedVibe: VibeType;
  setSelectedVibe: (vibe: VibeType) => void;
}

const VibeSelector = ({ selectedVibe, setSelectedVibe }: VibeSelectorProps) => {
  const vibes: { type: VibeType; icon: string; label: string; description: string }[] = [
    { type: "random", icon: "ri-shuffle-line", label: "Random", description: "Surprise me with any type" },
    { type: "funny", icon: "ri-emotion-laugh-line", label: "Funny", description: "Lighthearted and humorous" },
    { type: "deep", icon: "ri-brain-line", label: "Deep", description: "Thoughtful and meaningful" },
    { type: "creative", icon: "ri-lightbulb-line", label: "Creative", description: "Imaginative thinking" },
    { type: "teambuilding", icon: "ri-team-line", label: "Team Building", description: "Strengthen connections" },
    { type: "technical", icon: "ri-code-line", label: "Technical", description: "Skills and knowledge" },
    { type: "reflection", icon: "ri-mind-map-line", label: "Reflection", description: "Introspection and learning" },
    { type: "energizer", icon: "ri-battery-charge-line", label: "Energizer", description: "Boost team energy" },
  ];

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="text-center mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Select a vibe for your team engagement</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {vibes.map((vibe) => (
          <button
            key={vibe.type}
            className={`group relative px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm ${
              selectedVibe === vibe.type
                ? "bg-primary text-white ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800"
                : "bg-white border border-gray-200 text-gray-700 hover:border-primary/30 hover:bg-primary/5 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary/30 dark:hover:bg-primary/10"
            }`}
            onClick={() => setSelectedVibe(vibe.type)}
            title={`Generate a ${vibe.label} icebreaker: ${vibe.description}`}
          >
            <div className="flex flex-col items-center">
              <i className={`${vibe.icon} text-xl ${selectedVibe === vibe.type ? "animate-pulse" : ""}`}></i>
              <span className="mt-1">{vibe.label}</span>
              {selectedVibe === vibe.type && (
                <span className="text-xs mt-1 opacity-80">{vibe.description}</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default VibeSelector;
