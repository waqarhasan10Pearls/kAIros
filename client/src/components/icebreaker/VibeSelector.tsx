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
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {vibes.map((vibe) => (
        <button
          key={vibe.type}
          className={`px-4 py-2 rounded-full font-medium shadow-sm hover:shadow-md transition-all ${
            selectedVibe === vibe.type
              ? "bg-primary text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setSelectedVibe(vibe.type)}
        >
          <i className={`${vibe.icon} mr-1`}></i> {vibe.label}
        </button>
      ))}
    </div>
  );
};

export default VibeSelector;
