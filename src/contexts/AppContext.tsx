import React, { createContext, useContext, useState, ReactNode } from 'react';

type PageSize = 5 | 10 | 20 | 50;

interface AppContextType {
    pageSize: PageSize;
    setPageSize: (size: PageSize) => void;
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [pageSize, setPageSize] = useState<PageSize>(5);
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <AppContext.Provider value={{ pageSize, setPageSize, searchTerm, setSearchTerm }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};