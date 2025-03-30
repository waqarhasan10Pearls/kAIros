import KairosLogo from "./KairosLogo";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-primary/5 via-white to-primary/10 border-t border-primary/10 py-6 dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <KairosLogo size={30} className="text-primary/70 mr-2" />
            <span className="font-semibold text-primary/80">kAIros</span>
          </div>
          
          <div className="text-center text-gray-600 text-sm dark:text-gray-300">
            <p>© {new Date().getFullYear()} kAIros - AI-powered team coaching at the opportune moment</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-gray-200">
              <i className="ri-github-fill text-xl"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-gray-200">
              <i className="ri-linkedin-box-fill text-xl"></i>
            </a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-gray-200">
              <i className="ri-twitter-x-fill text-xl"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
