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
