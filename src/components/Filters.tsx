import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface FiltersProps {
    fields: { key: string; label: string }[];
    onFilterChange: (filters: Record<string, string>) => void;
}

const Filters: React.FC<FiltersProps> = ({ fields, onFilterChange }) => {
    const { pageSize, setPageSize, searchTerm, setSearchTerm } = useAppContext();
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [showSearch, setShowSearch] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const handleFilterChange = (field: string, value: string) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
        setActiveFilter(field);
    };

    const removeFilter = (field: string) => {
        const { [field]: _, ...newFilters } = filters;
        setFilters(newFilters);
        onFilterChange(newFilters);
        setActiveFilter(null);
    };

    return (
        <div className="filters">
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value) as 5 | 10 | 20 | 50)}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
            <span>Entries</span>
            <span className="separator">|</span>
            <button onClick={() => setShowSearch(!showSearch)}>🔍</button>
            {showSearch && (
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            )}
            <span className="separator">|</span>
            {fields.map((field) => (
                <div key={field.key} className="filter-dropdown">
                    <button onClick={() => setActiveFilter(activeFilter === field.key ? null : field.key)}>
                        {field.label} ▼
                    </button>
                    {activeFilter === field.key && (
                        <div className="filter-input">
                            <input
                                type="text"
                                placeholder={`Filter by ${field.label}`}
                                value={filters[field.key] || ''}
                                onChange={(e) => handleFilterChange(field.key, e.target.value)}
                            />
                            {filters[field.key] && (
                                <button onClick={() => removeFilter(field.key)}>×</button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Filters;