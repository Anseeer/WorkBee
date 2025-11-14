import { useEffect, useState } from "react";
import { fetchTopService } from "../../services/userService";
import { useNavigate } from "react-router-dom";

interface IService {
    _id: string,
    categoryIcon: string,
    categoryName: string,
    categoryId: string,
    isActive: boolean,
    name: string,
    image: string,
    wage: string,
}

const PopularProjects = () => {

    const [services, setService] = useState<IService[] | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const HandleSelectedService = (serv: IService) => {
        localStorage.removeItem("serviceId")
        localStorage.removeItem("categoryId")
        localStorage.setItem("serviceId", serv._id as string);
        localStorage.setItem("categoryId", serv.categoryId);
        navigate('/work-details');
    }

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const topService = await fetchTopService(6);
            setService(topService);
            setIsLoading(false);
        }
        fetchData();
    }, [])

    return (
        <>
            {services && services?.length > 0 &&
                (<div className="max-w-7xl mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold text-gray-900 p-10 mb-10">Popular Projects</h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {isLoading ? (
                            // Loading Skeletons
                            Array.from({ length: 6 }).map((_, index) => (
                                <div
                                    key={`skeleton-${index}`}
                                    className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 opacity-0 animate-fadeInUp"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animationFillMode: 'forwards'
                                    }}
                                >
                                    <div className="relative h-48 bg-gray-200 animate-pulse"></div>
                                    <div className="p-6 text-center space-y-3">
                                        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            services?.map((service, index) => (
                                <div
                                    onClick={() => {
                                        HandleSelectedService(service);
                                    }}
                                    key={service._id}
                                    className="bg-white cursor-pointer rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 opacity-0 animate-fadeInUp group hover:-translate-y-2"
                                    style={{
                                        animationDelay: `${index * 100}ms`,
                                        animationFillMode: 'forwards'
                                    }}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 text-center">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-900 transition-colors duration-300">
                                            {service.name}
                                        </h3>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                )}
        </>
    );
};

export default PopularProjects;