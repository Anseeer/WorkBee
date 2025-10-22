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
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [visibleCount, setVisibleCount] = useState(12);

    useEffect(() => {
        const updateVisibleCount = () => {
            const width = window.innerWidth;
            if (width < 640) setVisibleCount(4);
            else if (width < 768) setVisibleCount(6);
            else if (width < 1024) setVisibleCount(8);
            else setVisibleCount(12);
        };

        updateVisibleCount();
        window.addEventListener("resize", updateVisibleCount);
        return () => window.removeEventListener("resize", updateVisibleCount);
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            setIsLoading(true);
            try {
                const response = await fetchService();
                setServices(response.data.data.service);
                setNotFound(false);
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(async () => {
            if (searchTerm.trim() === "") {
                setIsLoading(true);
                const response = await fetchService();
                console.log("Res:", response.data.data.services)
                setServices(response.data.data.services);
                setNotFound(false);
                setIsLoading(false);
            } else {
                setIsLoading(true);
                try {
                    const response = await fetchServiceBySearchTerm(searchTerm);
                    const results = response.data.data;
                    setServices(results);
                    setNotFound(results.length === 0);
                } catch (error) {
                    console.error("Search failed:", error);
                    setNotFound(true);
                } finally {
                    setIsLoading(false);
                }
            }
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    const HandleSelectedService = (serv: IService) => {
        localStorage.removeItem("serviceId")
        localStorage.removeItem("categoryId")
        console.log("Serve :", serv);
        localStorage.setItem("serviceId", serv._id as string || serv.id as string);
        localStorage.setItem("categoryId", serv.category);
        navigate('/work-details');
    }
    const user = useSelector((state: RootState) => state?.user.user);
    console.log("UserData in redux :", user)

    return (
        <div className="w-full min-h-[500px] flex flex-col items-center justify-center py-12 px-4">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-black text-center py-6 sm:py-10 animate-fadeIn">
                Find Help <span className="text-green-900">Now</span>
            </h1>

            {/* Search Box */}
            <div
                className="w-full max-w-2xl relative animate-fadeIn"
                style={{ animationDelay: "400ms", animationFillMode: "backwards" }}
            >
                <div
                    className="relative flex items-center rounded-full overflow-hidden bg-white shadow-lg border border-green-900 focus-within:ring-2 focus-within:ring-green-900 transition-all duration-300 hover:shadow-xl"
                >
                    <input
                        type="text"
                        placeholder="What do you need help with?"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 text-base md:text-lg px-6 sm:px-8 py-4 sm:py-5 focus:outline-none bg-transparent text-black placeholder-gray-400"
                    />
                    <button
                        className="bg-green-900 hover:bg-green-800 transition-colors duration-300 px-6 sm:px-8 py-[1.15rem] sm:py-[1.35rem] flex items-center justify-center group rounded-r-full"
                        aria-label="Search"
                    >
                        <Search className="text-white w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />
                    </button>
                </div>

                {/* Search suggestion hint */}
                {searchTerm === "" && (
                    <p className="text-gray-400 text-xs sm:text-sm text-center mt-3 animate-pulse">
                        Try "plumbing", "electrical", "cleaning"...
                    </p>
                )}
            </div>


            {/* Service Buttons */}
            <div className="w-full max-w-6xl mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 px-4 sm:px-8">
                {isLoading ? (
                    // // Loading skeleton
                    Array.from({ length: visibleCount }).map((_, index) => (
                        <div
                            key={`skeleton-${index}`}
                            className="bg-white h-10 rounded-full animate-pulse"
                        />
                    ))
                ) : !notFound ? (
                    services?.slice(0, visibleCount).map((service, index) => (
                        <button
                            onClick={() => HandleSelectedService(service)}
                            key={service.id}
                            className="text-black text-sm sm:text-base px-3 sm:px-4 py-2 rounded-full font-medium shadow bg-white border-2 border-gray-300 hover:border-green-600 hover:text-green-600 transition break-words text-center opacity-0 animate-fadeInUp"
                            style={{
                                animationDelay: `${index * 80}ms`,
                                animationFillMode: 'forwards'
                            }}
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