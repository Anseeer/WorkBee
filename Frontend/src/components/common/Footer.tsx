import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#2B4E34] text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">

          {/* Logo/Brand Section */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-200 mb-2">WorkBee</h2>
            <p className="text-gray-300 text-sm">Your trusted service platform</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <a
              href="/about"
              className="text-gray-200 hover:text-gray-300 transition-colors text-sm font-medium"
            >
              About
            </a>
            <a
              href="/terms"
              className="text-gray-200 hover:text-gray-300 transition-colors text-sm font-medium"
            >
              Terms & Conditions
            </a>
            <a
              href="/workers"
              className=" text-gray-300 px-5 py-2 rounded-full font-medium"
            >
              Become a Worker
            </a>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/20"></div>

        {/* Copyright */}
        <div className="text-center pt-6">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} WorkBee. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}