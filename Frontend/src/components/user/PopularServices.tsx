import { useEffect, useState } from "react";
import { fetchTopService } from "../../services/userService";
import HomeRepairServiceImage from "../../assets/homeRepair-Service.jpg";
import MovingServiceImage from "../../assets/moving-service.jpg";
import OutdoorServiceImage from "../../assets/outdoor-service.jpg"
import PaintingServiceImage from "../../assets/painting-service.jpg"
import CleaningServiceImage from "../../assets/cleaning-service.jpg"
import DomesticServiceImage from "../../assets/domesti-help-service.png"
import { useNavigate } from "react-router-dom";

interface IService {
    _id: string,
    categoryIcon: string,
    categoryName: string,
    categoryId: string,
    isActive: boolean,
    name: string,
    wage: string,
}

const categoryImages: { [key: string]: string } = {
    'Cleaning': CleaningServiceImage,
    'Moving': MovingServiceImage,
    'Outdoor': OutdoorServiceImage,
    'Painting': PaintingServiceImage,
    'Domestic Help Services': DomesticServiceImage,
    "Home Repair": HomeRepairServiceImage,
};

const PopularProjects = () => {

    const [services, setService] = useState<IService[] | null>(null)
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
            const topService = await fetchTopService(6);
            console.log("TopService :", topService)
            setService(topService);
        }
        fetchData();
    }, [])

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-900 p-10 mb-10">Popular Projects</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {services?.map((service) => (
                    <div
                        onClick={() => {
                            HandleSelectedService(service);
                        }}
                        key={service._id}
                        className="bg-white cursor-pointer rounded-2xl shadow-md hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100"
                    >
                        {/* Image Container */}
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                            <img
                                src={categoryImages[service.categoryIcon] || service.categoryIcon}
                                alt={service.name}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-6 text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {service.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                                Project starting at <span className="font-semibold text-gray-900">{service.wage}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularProjects;