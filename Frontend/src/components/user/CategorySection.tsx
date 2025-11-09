import HomeRepairBanner from "../../assets/HomeRepairBanner.png";
import PaintingBanner from "../../assets/painting-banner.png";
import CleaningBanner from "../../assets/cleaning-banner.png";
import OutdoorBanner from "../../assets/outdoor-banner.png";
import DomesticHelpBanner from "../../assets/DomesticHelpServiceBanner.png";
import MovingBanner from "../../assets/moving-banner.png";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCategory } from "../../services/adminService";
import type { ICategory } from "../../types/ICategory";
import { getServiceByCategory } from "../../services/workerService";
import type { IService } from "../../types/IService";
import { useNavigate } from "react-router-dom";

const backgroundMap: Record<string, string> = {
    "Home Repair": HomeRepairBanner,
    "Domestic Help Services": DomesticHelpBanner,
    "Painting": PaintingBanner,
    "Cleaning": CleaningBanner,
    "Outdoor": OutdoorBanner,
    "Moving": MovingBanner,
};

const CategorySection: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [services, setServices] = useState<IService[]>([]);
    const [selectedService, setSelectedService] = useState("");
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isLoadingServices, setIsLoadingServices] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const HandleSelectedService = (serv: IService) => {
        localStorage.removeItem("serviceId")
        localStorage.removeItem("categoryId")
        localStorage.setItem("serviceId", serv._id as string);
        localStorage.setItem("categoryId", serv.category);
        navigate('/work-details');
    }
    const currentCategory = categories.find((cat) => cat._id === selectedCategory);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchCategory(1, 1000);
                const fetchedCategories = response.data.data.category.filter(
                    (cat: ICategory) => cat.isActive === true
                );

                if (fetchedCategories.length > 0) {
                    console.log("Fetched category :", fetchedCategories)
                    setCategories(fetchedCategories);
                    setSelectedCategory(fetchedCategories[0]._id);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            if (!selectedCategory) return;

            setIsLoadingServices(true);
            setAnimationKey(prev => prev + 1);

            try {
                const serv = await getServiceByCategory([selectedCategory]);
                console.log("Services fetched :", serv)
                if (typeof serv !== 'string') {
                    setServices(serv.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch services:", error);
            } finally {
                setIsLoadingServices(false);
            }
        };
        fetchServices();
    }, [selectedCategory]);

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
        }
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            checkScrollPosition();
            scrollContainer.addEventListener("scroll", checkScrollPosition);
            return () =>
                scrollContainer.removeEventListener("scroll", checkScrollPosition);
        }
    }, [categories]);

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    };

    const truncateWords = (text: string, wordLimit: number) => {
        const words = text.split(" ");
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ") + " ..."
            : text;
    };


    return (
        <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 my-5 min-h-screen">
            <div className="mb-8 relative">
                <button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className={`absolute -left-2 sm:-left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10 transition-all duration-200 ${canScrollLeft
                        ? "hover:bg-green-100 text-green-600"
                        : "text-gray-300 cursor-not-allowed"
                        }`}
                >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex justify-start sm:justify-center flex-nowrap overflow-x-auto w-full gap-6 sm:gap-10 mb-2 px-4 sm:px-8 scrollbar-hide"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {categories.map((category, index) => (
                        <div
                            key={category._id}
                            onClick={() => {
                                setSelectedCategory(category._id);
                                setSelectedService("");
                            }}
                            className={`flex flex-col items-center cursor-pointer transition-all duration-300 p-3 sm:p-4 rounded-lg min-w-[100px] sm:min-w-[120px] opacity-0 animate-fadeInUp ${selectedCategory === category._id
                                ? "text-green-800 bg-white shadow-md scale-105"
                                : "text-gray-600 hover:text-green-600 hover:scale-105"
                                }`}
                            style={{
                                animationDelay: `${index * 80}ms`,
                                animationFillMode: 'forwards'
                            }}
                        >
                            <div className="mb-2 overflow-hidden rounded-lg">
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded transition-transform duration-300 hover:scale-110"
                                />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-center break-words">
                                {category.name}
                            </span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className={`absolute -right-2 sm:-right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10 transition-all duration-200 ${canScrollRight
                        ? "hover:bg-green-100 text-green-600"
                        : "text-gray-300 cursor-not-allowed"
                        }`}
                >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                <div className="h-1 bg-green-900 w-full rounded"></div>
            </div>

            {currentCategory && (
                <div key={animationKey} className="mb-8 animate-slideIn">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 text-center animate-fadeInDown">
                        Select a <span className="text-green-900">{currentCategory.name}</span> Service
                    </h3>

                    {isLoadingServices ? (
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                            {Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={`skeleton-${index}`}
                                    className="px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gray-200 animate-pulse h-10 w-32"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                            {services.map((service, index) => (
                                <button
                                    key={service.id}
                                    onClick={() => {
                                        setSelectedService(service.name.toLowerCase());
                                        HandleSelectedService(service);
                                    }}
                                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full border-2 font-medium transition-all duration-200 whitespace-normal text-center opacity-0 animate-fadeInScale ${selectedService === service.name.toLowerCase()
                                        ? "bg-green-800 text-white border-green-600 shadow-lg scale-105"
                                        : "bg-white text-gray-700 border-gray-300 hover:border-green-600 hover:text-green-600 hover:shadow-md"
                                        }`}
                                    style={{
                                        animationDelay: `${index * 60}ms`,
                                        animationFillMode: 'forwards'
                                    }}
                                >
                                    {truncateWords(service.name, 2)}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {currentCategory && (
                <div
                    key={`banner-${animationKey}`}
                    className="relative rounded-2xl p-4 sm:p-8 min-h-[400px] sm:min-h-[600px] transition-all duration-500 flex flex-col sm:flex-row items-center justify-center sm:justify-between animate-zoomIn overflow-hidden"
                >
                    <img
                        src={backgroundMap[currentCategory.name]}
                        alt={`${currentCategory.name} background`}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl animate-scaleIn"
                    />

                    <div className="relative bg-white rounded-lg p-4 sm:p-6 shadow-2xl min-h-[200px] sm:min-h-[250px] w-full sm:w-[350px] mx-auto sm:ml-8 flex flex-col justify-center text-center sm:text-left animate-slideInRight">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                            {currentCategory.name}
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg">
                            {selectedService
                                ? `Professional ${selectedService} services available in your area.`
                                : currentCategory.description}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategorySection;