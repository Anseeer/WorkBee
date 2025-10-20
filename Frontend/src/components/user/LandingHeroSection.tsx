import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import HeroImg from "../../assets/HeroImg.png";
import { fetchServiceBySearchTerm } from "../../services/userService";
import type { IService } from "../../types/IServiceTypes";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [services, setServices] = useState<IService[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim()) {
                handleSearch(searchTerm);
            } else {
                setServices([]);
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const handleSearch = async (term: string) => {
        try {
            setIsLoading(true);
            const response = await fetchServiceBySearchTerm(term);
            setServices(response.data.data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const HandleSelectedService = (serv: IService) => {
        localStorage.removeItem("serviceId")
        localStorage.removeItem("categoryId")
        localStorage.setItem("serviceId", serv._id as string);
        localStorage.setItem("categoryId", serv.category);
        navigate('/work-details');
    }

    return (
        <section className="bg-white items-center relative">
            <div className="max-w-7xl mx-auto px-6 grid py-5 grid-cols-1 md:grid-cols-2 gap-10 items-center">

                {/* Left Section */}
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

                    {/* Search Bar */}
                    <div className="relative w-full max-w-md">
                        <div className="flex rounded-full border border-green-900 overflow-hidden shadow-lg">
                            <input
                                type="text"
                                placeholder="What do you need help with ?"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-5 py-3 text-green-900 placeholder-gray-500 focus:outline-none"
                            />
                            <button className="bg-green-900 text-white px-4">
                                <Search size={20} />
                            </button>
                        </div>

                        {/* Service Buttons (Grid) */}
                        {searchTerm && services.length > 0 && (
                            <div className="absolute mt-3 w-md  p-4 z-10">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {services?.slice(0, 6).map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() => HandleSelectedService(service)}
                                            className="bg-[#F5FAF5] text-black text-sm px-3 py-2 rounded-full font-medium shadow hover:bg-green-100 transition"
                                        >
                                            {service.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Not Found */}
                        {searchTerm && !isLoading && services.length === 0 && (
                            <div className="absolute mt-3 w-full bg-white border border-gray-200 rounded-lg shadow-md p-3 text-gray-500 text-sm">
                                No services found
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Section */}
                <div className="w-full p-5">
                    <img
                        src={HeroImg}
                        alt="Skilled worker"
                        className="w-full h-[500px] object-cover rounded-sm shadow-lg"
                    />
                </div>
               
            </div>
        </section>
    );
};

export default HeroSection;
