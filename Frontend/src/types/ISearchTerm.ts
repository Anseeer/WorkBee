export interface ISearchTerm {
    categoryId: string;
    serviceId: string;
    location: {
        lat: number;
        lng: number;
        pincode: string;
        address: string;
    };
    selectedTimeSlots: string[];
    maxPrice: number;
    minRating: number;
    minCompletedWorks: number;
}