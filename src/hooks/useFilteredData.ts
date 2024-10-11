import { useState, useMemo, useEffect } from 'react';

export interface FilterField<T> {
    key: keyof T | string;
    label: string;
    options?: string[];
    fields?: (keyof T)[];
    exact?: boolean;
}

export interface UseFilteredDataProps<T> {
    data: T[];
    columns: { key: keyof T; label: string }[];
    filterFields: FilterField<T>[];
    searchTerm: string;
    pageSize: number;
    activeTab?: string;
    tabField?: keyof T;
}

export function useFilteredData<T>({
                                       data,
                                       columns,
                                       filterFields,
                                       searchTerm,
                                       pageSize,
                                       activeTab,
                                       tabField,
                                   }: UseFilteredDataProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            // Apply tab filter if applicable
            const matchesTab =
                !activeTab || !tabField || activeTab === 'ALL' || item[tabField] === activeTab;

            // Apply search term
            const matchesSearch = columns.some((column) => {
                const value = item[column.key];
                return (
                    value !== undefined &&
                    value !== null &&
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                );
            });

            // Apply filters
            const matchesFilters = Object.entries(filters).every(([filterKey, filterValue]) => {
                const filterField = filterFields.find((f) => String(f.key) === filterKey);
                if (!filterField) return true;
                const exactMatch = filterField.exact ?? false;

                if (filterField.fields) {
                    // Multiple fields to search in
                    return filterField.fields.some((field) => {
                        const itemValue = item[field];
                        return (
                            itemValue !== undefined &&
                            itemValue !== null &&
                            (exactMatch
                                ? itemValue.toString().toLowerCase() === filterValue.toLowerCase()
                                : itemValue.toString().toLowerCase().includes(filterValue.toLowerCase()))
                        );
                    });
                } else {
                    const itemValue = item[filterKey as keyof T];
                    return (
                        itemValue !== undefined &&
                        itemValue !== null &&
                        (exactMatch
                            ? itemValue.toString().toLowerCase() === filterValue.toLowerCase()
                            : itemValue.toString().toLowerCase().includes(filterValue.toLowerCase()))
                    );
                }
            });

            return matchesTab && matchesSearch && matchesFilters;
        });
    }, [data, searchTerm, columns, filters, activeTab, tabField, filterFields]);

    const totalFilteredPages = Math.ceil(filteredData.length / pageSize);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters, activeTab]);

    return {
        currentPage,
        setCurrentPage,
        filters,
        setFilters,
        filteredData,
        paginatedData,
        totalFilteredPages,
    };
}