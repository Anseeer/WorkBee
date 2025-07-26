import { Search } from "lucide-react";
import HeroImg from "../../assets/HeroImg.png"
import GuideImg from "../../assets/guidImg.png"

const HeroSection = () => {
    return (
        <section className="bg-white items-center">
            <div className="max-w-7xl mx-auto px-6 grid py-5 grid-cols-1 md:grid-cols-2 gap-10 items-center">

                <div className="space-y-6">
                    <h1 className="text-5xl font-bold text-black-900 leading-snug">
                        Welcome To WorkBee
                    </h1>
                    <h4 className="text-3xl font-semibold text-black-900 leading-snug">
                        Connect. Work. Earn. Repeat.
                    </h4>
                    <p className="text-green-950 text-lg leading-relaxed">
                        WorkBee is a smart platform connecting job seekers with individuals offering daily wage and short-term jobs. Whether you’re looking to hire a helping hand or earn through skilled work, WorkBee makes it fast and simple.
                    </p>

                    <div className="flex rounded-full border border-green-900 overflow-hidden shadow-lg w-full max-w-md">
                        <input
                            type="text"
                            placeholder="What do you need help with ?"
                            className="w-full px-5 py-3 text-green-900 placeholder-gray-500 focus:outline-none"
                        />
                        <button className="bg-green-900 text-white px-4">
                            <Search size={20} />
                        </button>
                    </div>
                </div>
                {/* hero image section */}
                <div className="w-full p-5">
                    <img
                        src={HeroImg}
                        alt="Skilled worker"
                        className="w-full h-[500px] object-cover rounded-sm shadow-lg"
                    />
                </div>
            </div>
            {/* guide img */}
            <div className="w-full">
                <img
                    sizes="20"
                    src={GuideImg}
                    alt="GuideImg"
                    className="w-[auto]"
                />
            </div>
        </section>
    )
}

export default HeroSection;