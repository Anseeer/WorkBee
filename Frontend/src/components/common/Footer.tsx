import instagramIcon from "../../assets/instagram-icon.png"
import facebookIcon from "../../assets/facebook-icon.png"

export default function Footer() {
  return (
    <footer className="bg-[#2B4E34] text-black px-4 py-10 md:px-12  ">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        <div>
          <h3 className="text-xl md:text-xl font-semibold mb-4">Follow us! We're friendly:</h3>
          <div className="flex space-x-4">
            <a href="" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Facebook" className="w-6 h-6" />
            </a>
            <a href="" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg md:text-xl font-semibold mb-4">Discover</h4>
          <ul className="space-y-2 text-sm md:text-base">
            <li><a href="#">Become a Tasker</a></li>
            <li><a href="#">Service By City</a></li>
            <li><a href="#">Service Nearby</a></li>
            <li><a href="#">Service All</a></li>
            <li><a href="#">Help</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg md:text-xl font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm md:text-base">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Terms & Privacy</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-black mt-10 pt-4 text-center text-xs text-gray-/70">
        © {new Date().getFullYear()} WorkBee. All rights reserved.
      </div>
    </footer>
  );
}
