const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} ScrumMaster Assistant. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
