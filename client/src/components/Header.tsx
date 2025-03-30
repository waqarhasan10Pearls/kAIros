import { useTheme } from "../hooks/useTheme";
import KairosLogo from "./KairosLogo";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

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
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
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
