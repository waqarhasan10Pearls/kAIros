import KairosLogo from "./KairosLogo";
import { useEffect, useState } from "react";

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  
  // Check if dark mode is active
  const checkDarkMode = () => {
    return document.documentElement.classList.contains("dark");
  };
  
  // Update state when component mounts and when theme changes
  useEffect(() => {
    // Set initial state
    setIsDark(checkDarkMode());
    
    // Create a mutation observer to watch for theme changes
    const observer = new MutationObserver(() => {
      setIsDark(checkDarkMode());
    });
    
    // Start observing
    observer.observe(document.documentElement, { 
      attributes: true,
      attributeFilter: ['class'] 
    });
    
    // Cleanup
    return () => observer.disconnect();
  }, []);
  
  // Handle theme toggle - uses the global function defined in main.tsx
  const handleToggleTheme = () => {
    window.toggleTheme();
  };
  
  return (
    <header className="bg-gradient-to-r from-primary/10 via-white to-primary/5 shadow-md border-b border-primary/10 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <KairosLogo size={50} className="text-primary mr-3" />
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-primary flex items-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                kAIros
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                AI-powered team coaching—at the moment it matters
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="px-3 py-2 rounded-lg flex items-center gap-2 font-medium text-sm bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              onClick={handleToggleTheme}
              aria-label="Toggle dark mode"
              id="theme-toggle-button"
            >
              {isDark ? (
                <>
                  <i className="ri-sun-line text-lg"></i>
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <i className="ri-moon-line text-lg"></i>
                  <span>Dark Mode</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
