export interface MappedMonthlyEarningDTO {
    period: "month";
    month: number;
    totalEarnings: number;
}

export interface MappedYearlyEarningDTO {
    period: "year";
    year: number;
    totalEarnings: number;
}

export type MappedEarningDTO = MappedMonthlyEarningDTO | MappedYearlyEarningDTO;
