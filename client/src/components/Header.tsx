import { useTheme } from "../hooks/useTheme";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-primary flex items-center">
              <i className="ri-timer-flash-line mr-2"></i>
              kAIros
            </h1>
            <p className="text-sm text-gray-500">Your AI Tour Guide for your Agile Journey - Practice and Master Team Facilitation & Coaching</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-600 hover:text-primary transition-colors"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <i className="ri-sun-line text-xl"></i>
              ) : (
                <i className="ri-moon-line text-xl"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
