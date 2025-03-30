import { VibeType } from "../../lib/types";

interface VibeSelectorProps {
  selectedVibe: VibeType;
  setSelectedVibe: (vibe: VibeType) => void;
}

const VibeSelector = ({ selectedVibe, setSelectedVibe }: VibeSelectorProps) => {
  const vibes: { type: VibeType; icon: string; label: string }[] = [
    { type: "random", icon: "ri-shuffle-line", label: "Random" },
    { type: "funny", icon: "ri-emotion-laugh-line", label: "Funny" },
    { type: "deep", icon: "ri-brain-line", label: "Deep" },
    { type: "creative", icon: "ri-lightbulb-line", label: "Creative" },
    { type: "teambuilding", icon: "ri-team-line", label: "Team Building" },
    { type: "technical", icon: "ri-code-line", label: "Technical" },
    { type: "reflection", icon: "ri-mind-map-line", label: "Reflection" },
    { type: "energizer", icon: "ri-battery-charge-line", label: "Energizer" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-8 max-w-3xl mx-auto">
      {vibes.map((vibe) => (
        <button
          key={vibe.type}
          className={`px-3 py-2 rounded-full font-medium shadow-sm hover:shadow-md transition-all text-sm sm:text-base ${
            selectedVibe === vibe.type
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedVibe(vibe.type)}
          title={`Generate a ${vibe.label} icebreaker question`}
        >
          <i className={`${vibe.icon} mr-1`}></i> {vibe.label}
        </button>
      ))}
    </div>
  );
};

export default VibeSelector;
