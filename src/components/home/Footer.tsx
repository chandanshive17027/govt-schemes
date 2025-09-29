import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-blue-100 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Website Name */}
        <div className="text-xl font-bold text-white">MyScheme Connect</div>

        {/* Quick Links */}
        <div className="flex flex-col md:flex-row gap-6 text-sm">
          <a href="#hero" className="hover:text-white transition-colors">Home</a>
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 text-white">
          <a href="#" className="hover:text-blue-300 transition-colors">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-blue-300 transition-colors">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-blue-300 transition-colors">
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-10 text-center text-sm text-blue-200">
        &copy; {new Date().getFullYear()} MyScheme Connect. All rights reserved.
      </div>
    </footer>
  );
}
