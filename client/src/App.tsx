import { useState } from "react";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Footer from "./components/Footer";
import IcebreakerTab from "./components/icebreaker/IcebreakerTab";
import SimulatorTab from "./components/simulator/SimulatorTab";

type TabType = "icebreaker" | "simulator";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("icebreaker");

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm sm:text-base ${
                activeTab === "icebreaker"
                  ? "text-primary border-primary"
                  : "text-gray-500 hover:text-gray-700 border-transparent"
              }`}
              onClick={() => setActiveTab("icebreaker")}
            >
              <i className="ri-chat-1-line mr-1"></i> Icebreaker Generator
            </button>
            <button
              className={`px-4 py-2 border-b-2 font-medium text-sm sm:text-base ${
                activeTab === "simulator"
                  ? "text-primary border-primary"
                  : "text-gray-500 hover:text-gray-700 border-transparent"
              }`}
              onClick={() => setActiveTab("simulator")}
            >
              <i className="ri-group-line mr-1"></i> Scrum Simulator
            </button>
          </nav>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {activeTab === "icebreaker" ? <IcebreakerTab /> : <SimulatorTab />}
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
