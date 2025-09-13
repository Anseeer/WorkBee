import instagramIcon from "../../assets/instagram-icon.png"
import facebookIcon from "../../assets/facebook-icon.png"

export default function Footer() {
  return (
    <footer className="bg-[#2B4E34] text-black px-4 py-8 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {/* Social Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow us:</h3>
          <div className="flex space-x-4">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Discover Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Discover</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Become a Tasker</a></li>
            <li><a href="#" className="hover:underline">Service By City</a></li>
            <li><a href="#" className="hover:underline">Service Nearby</a></li>
            <li><a href="#" className="hover:underline">All Services</a></li>
            <li><a href="#" className="hover:underline">Help</a></li>
          </ul>
        </div>

        {/* Company Links */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">About Us</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
            <li><a href="#" className="hover:underline">Blog</a></li>
            <li><a href="#" className="hover:underline">Terms & Privacy</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-8 pt-4 text-center text-xs text-gray-300">
        © {new Date().getFullYear()} WorkBee. All rights reserved.
      </div>
    </footer>
  );

}
