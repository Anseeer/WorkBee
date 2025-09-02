/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { IService } from "../../types/IServiceTypes";
import { fetchService, fetchServiceBySearchTerm } from "../../services/userService";
import { useNavigate } from "react-router-dom";

const HomeHeroSection = () => {
    const [services, setServices] = useState<IService[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [notFound, setNotFound] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetchService();
                setServices(response.data.data.service);
                setNotFound(false);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.trim() === "") {
                const response = await fetchService();
                console.log("Res:", response.data.data.services)
                setServices(response.data.data.services);
                setNotFound(false);
            } else {
                try {
                    const response = await fetchServiceBySearchTerm(searchTerm);
                    const results = response.data.data;
                    setServices(results);
                    setNotFound(results.length === 0);
                } catch (error) {
                    console.error("Search failed:", error);
                    setNotFound(true);
                }
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const HandleSelectedService = (serv: IService) => {
        localStorage.removeItem("serviceId")
        localStorage.removeItem("categoryId")
        localStorage.setItem("serviceId", serv._id as string);
        localStorage.setItem("categoryId", serv.category);
        navigate('/work-details');
    }

    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setVisibleCount(12);
            } else if (width >= 768) {
                setVisibleCount(8);
            } else if (width >= 640) {
                setVisibleCount(4);
            } else {
                setVisibleCount(2);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="w-full h-[500px] flex flex-col items-center justify-center py-12 px-4">
            {/* Title */}
            <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl xl2:text-7xl font-semibold text-black py-10">
                Find Help Now
            </h1>

            {/* Search Box */}
            <div className=" max-w-ful h-md sm:w-md sm:h-sm md:w-lg md:h-lg lg:w-xl lg:h-xl xl:w-2xl border border-gray-300 flex rounded-full overflow-hidden bg-[#F5FAF5] shadow-md focus-within:border-transparent focus-within:ring-2 focus-within:ring-offset-0 focus-within:ring-green-900">
                <input
                    type="text"
                    placeholder="What do you need help with?"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 text-base sm:text-xs md:text-lg px-6 py-4 focus:outline-none bg-[#F5FAF5] text-black placeholder-gray-500"
                />
                <div className="bg-green-900 px-6 flex items-center justify-center">
                    <Search className="text-white w-6 h-6" />
                </div>
            </div>

            {/* Service Buttons */}
            <div className="
                            grid grid-cols-2 px-5 gap-2 
                            sm:grid-cols-2 sm:mt-5 
                            md:grid-cols-4 md:gap-4 md:mt-10 
                            lg:grid-cols-6 lg:mt-10 
                            xl:grid-cols-6 xl:mt-10 
                            2xl:gap-6
                            "
            >
                {!notFound ? (
                    services?.slice(0, visibleCount).map((service) => (
                        <button
                            onClick={() => HandleSelectedService(service)}
                            key={service.id}
                            className="bg-[#F5FAF5] text-black text-sm px-2 py-2 rounded-full font-medium shadow hover:bg-green-100 transition"
                        >
                            {service.name}
                        </button>
                    ))
                ) : (
                    <p className="text-red-500 text-lg font-medium col-span-full text-center">
                        No services found
                    </p>
                )}
            </div>
        </div>
    );
};

export default HomeHeroSection;
