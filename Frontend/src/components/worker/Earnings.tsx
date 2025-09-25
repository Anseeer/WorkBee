/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface Earnings {
    label: string;
    value: number;
}

interface EarningsChartProps {
    filter: "monthly" | "yearly";
    rawData: any[];
}

const normalizeEarnings = (rawData: any[], filter: "monthly" | "yearly"): Earnings[] => {
    if (filter === "monthly") {
        return rawData.map((d) => ({
            label: new Date(0, d._id?.month ? d._id.month - 1 : 0).toLocaleString("default", {
                month: "short",
            }),
            value: d.totalEarnings || 0,
        }));
    }

    if (filter === "yearly") {
        return rawData.map((d) => ({
            label: d._id?.year?.toString() || "",
            value: d.totalEarnings || 0,
        }));
    }

    return [];
};


const EarningsChart: React.FC<EarningsChartProps> = ({ filter, rawData }) => {
    const data = normalizeEarnings(rawData, filter);

    return (
        <div className="bg-white rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Earnings ({filter})
            </h3>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3B82F6"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default EarningsChart;
