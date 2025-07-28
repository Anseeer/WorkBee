import React, { createContext, useContext, useState } from "react";

interface DetailsContextType<T> {
  selectedDetails: T | null;
  setSelectedDetails: (details: T | null) => void;
}

export function createDetailsContext<T>() {
  const DetailsContext = createContext<DetailsContextType<T> | undefined>(undefined);

  const DetailsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedDetails, setSelectedDetails] = useState<T | null>(null);

    return (
      <DetailsContext.Provider value={{ selectedDetails, setSelectedDetails }}>
        {children}
      </DetailsContext.Provider>
    );
  };

  const useDetails = () => {
    const context = useContext(DetailsContext);
    if (!context) throw new Error("useDetails must be used within a DetailsProvider");
    return context;
  };

  return { DetailsProvider, useDetails };
}
