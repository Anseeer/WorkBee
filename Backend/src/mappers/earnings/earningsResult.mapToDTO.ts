import { EarningResult } from "../../utilities/earningsType";
import { MappedEarningDTO } from "./earnigsResult.DTO.interface";

export const mapEarningsToDTO = (earnings: EarningResult): MappedEarningDTO => {
    if ("month" in earnings._id) {
        return {
            period: "month", 
            month: earnings._id.month,
            totalEarnings: earnings.totalEarnings,
        };
    } else {
        return {
            period: "year", 
            year: earnings._id.year,
            totalEarnings: earnings.totalEarnings,
        };
    }
};
