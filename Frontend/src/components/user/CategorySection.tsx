import HomeRepairBanner from "../../assets/HomeRepairBanner.png";
import PaintingBanner from "../../assets/painting-banner.png";
import CleaningBanner from "../../assets/cleaning-banner.png";
import OutdoorBanner from "../../assets/outdoor-banner.png";
import MovingBanner from "../../assets/moving-banner.png";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchCategory } from "../../services/adminService";
import type { ICategory } from "../../types/ICategory";
import { getServiceByCategory } from "../../services/workerService";
import type { IService } from "../../types/IServiceTypes";
import { useNavigate } from "react-router-dom";

const backgroundMap: Record<string, string> = {
    "Home Repair": HomeRepairBanner,
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

    console.log("Selected Service :", selectedService);
    console.log("current Category :", currentCategory);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchCategory();
                const fetchedCategories = response.data.data.categories.filter(
                    (cat: ICategory) => cat.isActive === true
                );

                if (fetchedCategories.length > 0) {
                    setCategories(fetchedCategories);
                    setSelectedCategory(fetchedCategories[0]._id);
                }
                console.log("Categories Fetched:", fetchedCategories);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            if (!selectedCategory) return;
            try {
                const serv = await getServiceByCategory([selectedCategory]);
                setServices(serv.data.data);
            } catch (error) {
                console.error("Failed to fetch services:", error);
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

    return (
        <div className="w-full max-w-7xl mx-auto p-6 my-5 min-h-screen">
            <div className="mb-8 relative">
                <button
                    onClick={scrollLeft}
                    disabled={!canScrollLeft}
                    className={`absolute -left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10 transition-all duration-200 ${canScrollLeft
                        ? "hover:bg-green-100 text-green-600"
                        : "text-gray-300 cursor-not-allowed"
                        }`}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div
                    ref={scrollRef}
                    className="flex flex-nowrap overflow-x-auto w-full gap-20 justify-center mb-2 px-8 scrollbar-hide"
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                    }}
                >
                    {categories.map((category) => (
                        <div
                            key={category._id}
                            onClick={() => {
                                setSelectedCategory(category._id);
                                setSelectedService("");
                            }}
                            className={`flex flex-col items-center cursor-pointer transition-all duration-200 p-4 rounded-lg ${selectedCategory === category._id
                                ? "text-green-800 bg-white shadow-md"
                                : "text-gray-600 hover:text-green-600"
                                }`}
                        >
                            <div className="mb-2">
                                <img
                                    src={category.imageUrl}
                                    alt=""
                                    className="w-20 h-20 object-cover rounded"
                                />
                            </div>
                            <span className="text-sm font-medium">{category.name}</span>
                        </div>
                    ))}
                </div>

                <button
                    onClick={scrollRight}
                    disabled={!canScrollRight}
                    className={`absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10 transition-all duration-200 ${canScrollRight
                        ? "hover:bg-green-100 text-green-600"
                        : "text-gray-300 cursor-not-allowed"
                        }`}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div className="h-1 bg-green-900 w-full rounded"></div>
            </div>

            {currentCategory && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                        Select a {currentCategory.name} Service
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => {
                                    setSelectedService(service.name.toLowerCase())
                                    HandleSelectedService(service)
                                }}
                                className={`px-6 py-3 rounded-full border-2 font-medium transition-all duration-200 ${selectedService === service.name.toLowerCase()
                                    ? "bg-green-800 text-white border-green-600 shadow-lg scale-105"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-green-600 hover:text-green-600 hover:shadow-md"
                                    }`}
                            >
                                {service.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {currentCategory && (
                <div className="relative rounded-2xl p-8 h-[600px] shadow-xl transition-all duration-500 flex items-center justify-between">

                    <img
                        src={backgroundMap[currentCategory.name] || HomeRepairBanner} // fallback
                        alt={`${currentCategory.name} background`}
                        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                    />

                    <div className="relative bg-white rounded-lg p-6 shadow-2xl min-h-[250px] w-[350px] ml-8 flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            {currentCategory.name}
                        </h2>
                        <p className="text-gray-600 text-lg mb-4">
                            {selectedService
                                ? `Professional ${selectedService} services available in your area`
                                : currentCategory.description}
                        </p>
                    </div>
                </div>
            )}


        </div>
    );
};

export default CategorySection;
