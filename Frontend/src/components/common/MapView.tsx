import { useEffect } from "react";
import L from "leaflet";

interface Props {
    lat: number;
    lng: number;
}

const MapView = ({ lat, lng }: Props) => {
    useEffect(() => {
        const map = L.map("map-container").setView([lat, lng], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        L.marker([lat, lng]).addTo(map);

        return () => {
            map.remove();
        };
    }, [lat, lng]);

    return (
        <div
            id="map-container"
            className="w-full h-64 rounded-lg border border-gray-300"
        />
    );
};

export default MapView;
