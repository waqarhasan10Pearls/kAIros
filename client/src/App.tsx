import { useState, useEffect } from "react";
import { Toaster } from "./components/ui/toaster";
import Header from "./components/Header";
import Footer from "./components/Footer";
import IcebreakerTab from "./components/icebreaker/IcebreakerTab";
import SimulatorTab from "./components/simulator/SimulatorTab";
import KairosLogo from "./components/KairosLogo";
import WelcomeDialog from "./components/WelcomeDialog";

type TabType = "icebreaker" | "simulator";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("icebreaker");
  const [showWelcome, setShowWelcome] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Check if this is the first visit
  useEffect(() => {
    // For testing, we'll initially show the welcome dialog
    // In production, use the localStorage check
    setShowWelcome(true);
    
    // Uncomment for production
    // const hasVisitedBefore = localStorage.getItem("kairosHasVisited");
    // if (!hasVisitedBefore) {
    //   setShowWelcome(true);
    //   localStorage.setItem("kairosHasVisited", "true");
    // }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-primary/5 dark:from-gray-950 dark:to-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Decorative element */}
        <div className="absolute top-40 right-10 opacity-5 hidden lg:block">
          <KairosLogo size={200} className="text-primary" />
        </div>
        
        {/* Welcome Dialog */}
        <WelcomeDialog 
          open={showWelcome} 
          onOpenChange={setShowWelcome} 
        />
        
        {/* Feedback Dialog */}
        <WelcomeDialog 
          open={showFeedback} 
          onOpenChange={setShowFeedback}
          showFeedback={true}
        />
        
        {/* Floating feedback button */}
        <button
          onClick={() => setShowFeedback(true)}
          className="fixed bottom-6 right-6 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50 flex items-center justify-center"
          aria-label="Open feedback form"
        >
          <i className="ri-feedback-line text-lg mr-2"></i>
          <span className="font-medium text-sm">Share Feedback</span>
        </button>
        
        {/* Tab Navigation */}
        <div className="relative z-10 mb-8 mx-auto max-w-2xl">
          <nav className="flex p-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm dark:bg-gray-800/50">
            <button
              className={`flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
                activeTab === "icebreaker"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => setActiveTab("icebreaker")}
            >
              <i className={`ri-chat-1-line mr-2 ${activeTab === "icebreaker" ? "animate-pulse" : ""}`}></i> 
              Team Engagement
            </button>
            <button
              className={`flex-1 px-4 py-3 rounded-lg font-medium flex items-center justify-center transition-all duration-200 ${
                activeTab === "simulator"
                  ? "bg-primary text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50"
              }`}
              onClick={() => setActiveTab("simulator")}
            >
              <i className={`ri-group-line mr-2 ${activeTab === "simulator" ? "animate-pulse" : ""}`}></i> 
              Scrum Simulator
            </button>
          </nav>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700">
          {activeTab === "icebreaker" ? <IcebreakerTab /> : <SimulatorTab />}
        </div>
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
