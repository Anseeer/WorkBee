/* eslint-disable @typescript-eslint/no-explicit-any */
import debounce from "lodash.debounce";

export const fetchLocationSuggestions = debounce(async (
    text: string,
    setSuggestions: (value: any[]) => void,
    setError: (msg: string) => void
) => {
    if (!text || text.length < 2) return;

    try {
        const res = await fetch(
            `https://api.locationiq.com/v1/autocomplete?key=${import.meta.env.VITE_LOCATIONIQ_KEY}&q=${text}&limit=5&countrycodes=in`
        );

        const data = await res.json();

        // If API gives no India result
        if (!Array.isArray(data) || data.length === 0) {
            setError("Service not available in your location");
            setSuggestions([]);
            return;
        }

        const validSuggestions = data
            .filter((item: any) => item.address?.country_code === "in")
            .map((item: any) => ({
                address: item.display_name,
                pincode: item.address?.postcode ?? "",
                lat: Number(item.lat),
                lng: Number(item.lon),
            }));

        if (validSuggestions.length === 0) {
            setError("Service not available in your location");
            setSuggestions([]);
            return;
        }

        setError("");
        setSuggestions(validSuggestions);

    } catch (err) {
        console.log("Error:", err);
        setError("Location service error");
    }
}, 500);
