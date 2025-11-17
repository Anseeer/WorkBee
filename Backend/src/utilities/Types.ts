interface TopItem {
    _id: string;
    count: number;
}

export interface TopThreeResult {
    TopServices: TopItem[];
    TopCategory: TopItem[];
    TopWorker: TopItem[];
    TopUsers: TopItem[];
}

export interface TopThreeResultDTO {
    TopServices: TopItem[];
    TopCategory: TopItem[];
    TopWorker: TopItem[];
    TopUsers: TopItem[];
}

interface BaseEarning {
    totalEarnings: number;
}

export interface MonthlyEarning extends BaseEarning {
    _id: {
        month: number;
    };
}

export interface YearlyEarning extends BaseEarning {
    _id: {
        year: number;
    };
}

export type EarningResult = MonthlyEarning | YearlyEarning;
export type EarningResultDTO = MonthlyEarning | YearlyEarning;

export interface ISearchTerm {
    categoryId: string;
    serviceId: string;
    sortBy: string;
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

