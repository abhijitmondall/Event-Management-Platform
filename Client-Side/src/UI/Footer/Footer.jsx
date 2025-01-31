import { Link } from "react-router";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          {/* Left Section */}
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold">Event Management Platform</p>
            <p className="text-sm mt-2">© 2025 All rights reserved.</p>
          </div>

          {/* Right Section */}
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link to="#" className="hover:text-blue-400 transition-colors">
              About Us
            </Link>
            <Link to="#" className="hover:text-blue-400 transition-colors">
              Contact
            </Link>
            <Link to="#" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
