import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

interface FilterField {
    key: string;
    label: string;
    options?: string[];
    fields?: string[];
    exact?: boolean;
}

interface FiltersProps {
    fields: FilterField[];
    onFilterChange: (filters: Record<string, string>) => void;
}

const Filters: React.FC<FiltersProps> = ({ fields, onFilterChange }) => {
    const { pageSize, setPageSize, searchTerm, setSearchTerm } = useAppContext();
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [showSearch, setShowSearch] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const handleFilterChange = (field: string, value: string) => {
        let newFilters;
        if (value === '') {
            newFilters = {};
            setActiveFilter(null);
        } else {
            newFilters = { [field]: value }; // Reset other filters
            setActiveFilter(field);
        }
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const removeFilter = (field: string) => {
        setFilters({});
        onFilterChange({});
        setActiveFilter(null);
    };

    return (
        <div className="filters">
            <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value) as 5 | 10 | 20 | 50)}
            >
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
                            {field.options ? (
                                <div className="filter-options">
                                    {field.options.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => handleFilterChange(field.key, option)}
                                            className={filters[field.key] === option ? 'selected' : ''}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                    {filters[field.key] && (
                                        <button className="close-button" onClick={() => removeFilter(field.key)}>
                                            ×
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        placeholder={`Filter by ${field.label}`}
                                        value={filters[field.key] || ''}
                                        onChange={(e) => handleFilterChange(field.key, e.target.value)}
                                    />
                                    {filters[field.key] && (
                                        <button className="close-button" onClick={() => removeFilter(field.key)}>
                                            ×
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Filters;