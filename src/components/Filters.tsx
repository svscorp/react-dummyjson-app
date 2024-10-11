import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

export interface FilterField<T> {
    key: keyof T | string;
    label: string;
    options?: string[];
    fields?: (keyof T)[];
    exact?: boolean;
}

interface FiltersProps<T> {
    fields: FilterField<T>[];
    onFilterChange: (filters: Record<string, string>) => void;
}

const Filters = <T extends unknown>({ fields, onFilterChange }: FiltersProps<T>) => {
    const { pageSize, setPageSize, searchTerm, setSearchTerm } = useAppContext();
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [showSearch, setShowSearch] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const handleFilterChange = (field: string, value: string) => {
        const filterField = fields.find((f) => f.key === field);
        let newFilters;
        if (value === '') {
            newFilters = {};
        } else {
            newFilters = { [field]: value };
        }
        setFilters(newFilters);
        onFilterChange(newFilters);

        if (filterField && filterField.options) {
            setActiveFilter(null);
        }
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
                <FilterDropdown
                    key={String(field.key)} // Ensure key is a string
                    field={field}
                    isActive={activeFilter === field.key}
                    isFiltered={!!filters[field.key as string]}
                    filterValue={filters[field.key as string]}
                    setActiveFilter={setActiveFilter}
                    handleFilterChange={handleFilterChange}
                    removeFilter={removeFilter}
                />
            ))}
        </div>
    );
};

interface FilterDropdownProps<T> {
    field: FilterField<T>;
    isActive: boolean;
    isFiltered: boolean;
    filterValue: string;
    setActiveFilter: (key: string | null) => void;
    handleFilterChange: (field: string, value: string) => void;
    removeFilter: (field: string) => void;
}

const FilterDropdown = <T extends unknown>({
                                               field,
                                               isActive,
                                               isFiltered,
                                               filterValue,
                                               setActiveFilter,
                                               handleFilterChange,
                                               removeFilter,
                                           }: FilterDropdownProps<T>) => {
    return (
        <div className="filter-dropdown">
            <button onClick={() => setActiveFilter(isActive ? null : String(field.key))}>
                {field.label} ▼
            </button>
            {field.options ? (
                // Option filter
                <>
                    {isActive && (
                        <div className="filter-input">
                            <div className="filter-options">
                                {field.options.map((option) => (
                                    <button
                                        key={`${String(field.key)}-${option}`} // Convert field.key to string
                                        onClick={() => handleFilterChange(String(field.key), option)}
                                        className={filterValue === option ? 'selected' : ''}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {!isActive && isFiltered && (
                        <div className="selected-filter-under">
                            {filterValue}
                            <button className="close-button" onClick={() => removeFilter(String(field.key))}>
                                ×
                            </button>
                        </div>
                    )}
                </>
            ) : (
                // Text filter
                <>
                    {isActive && (
                        <div className="filter-input">
                            <div className="filter-text-dropdown">
                                <div className="input-with-close">
                                    <input
                                        type="text"
                                        placeholder={`Filter by ${field.label}`}
                                        value={filterValue || ''}
                                        onChange={(e) => handleFilterChange(String(field.key), e.target.value)}
                                    />
                                    {filterValue && (
                                        <button className="close-button" onClick={() => removeFilter(String(field.key))}>
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {!isActive && isFiltered && (
                        <div className="selected-filter-under">
                            {filterValue}
                            <button className="close-button" onClick={() => removeFilter(String(field.key))}>
                                ×
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Filters;