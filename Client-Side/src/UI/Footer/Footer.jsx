import React from "react";

function Footer(props) {
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
            <a href="#" className="hover:text-blue-400 transition-colors">
              About Us
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-blue-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
