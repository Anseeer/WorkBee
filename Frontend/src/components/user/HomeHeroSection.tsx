/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { IService } from "../../types/IServiceTypes";
import { fetchService, fetchServiceBySearchTerm } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store";

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
                console.log("Res:",response.data.data.services)
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
    const user = useSelector((state: RootState) => state?.user.user);
    console.log("UserData in redux :", user)


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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 text-base md:text-lg px-6 py-4 focus:outline-none bg-[#F5FAF5] text-black placeholder-gray-500"
                />
                <div className="bg-green-900 px-6 flex items-center justify-center">
                    <Search className="text-white w-6 h-6" />
                </div>
            </div>

            {/* Service Buttons */}
            <div className="grid grid-cols-2 px-20 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-10">
                {!notFound ? (
                    services?.slice(0, 12).map((service) => (
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
