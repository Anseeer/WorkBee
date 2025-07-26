import { Search } from "lucide-react";

const HomeHeroSection = () => {
    return (
        <div className="w-full h-[500px] flex flex-col items-center justify-center py-12 px-4">
            {/* Title */}
            <h1 className="text-3xl lg:text-5xl font-semibold text-black py-10">
                Find Help Now
            </h1>

            {/* Search Box */}
            <div className="w-full max-w-2xl border border-gray-300 flex rounded-full overflow-hidden bg-[#F5FAF5] shadow-md focus-within:border-transparent focus-within:ring-2 focus-within:ring-offset-0 focus-within:ring-green-900">
                <input
                    type="text"
                    placeholder="What do you need help with?"
                    className="flex-1 text-base md:text-lg px-6 py-4 focus:outline-none bg-[#F5FAF5] text-black placeholder-gray-500"
                />
                <div className="bg-green-900 px-6 flex items-center justify-center">
                    <Search className="text-white w-6 h-6" />
                </div>
            </div>

            {/* Category Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
                {Array(12).fill("Plumber").map((category, index) => (
                    <button
                        key={index}
                        className="bg-[#F5FAF5] text-black text-lg px-6 py-2 rounded-full font-medium shadow hover:bg-green-100 transition"
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HomeHeroSection;
