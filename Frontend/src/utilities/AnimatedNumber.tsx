import { useEffect, useState } from "react";

interface AnimatedNumberProps {
    value: number;
    duration?: number; 
    prefix?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, duration = 800, prefix = "" }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const increment = value / (duration / 16); 
        const interval = setInterval(() => {
            start += increment;
            if (start >= value) {
                setDisplayValue(value);
                clearInterval(interval);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);

        return () => clearInterval(interval);
    }, [value, duration]);

    return <span>{prefix}{displayValue}</span>;
};

export default AnimatedNumber;
