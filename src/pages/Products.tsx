import React, { useState, useEffect, useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import { useAppContext } from '../contexts/AppContext';
import DataTable from '../components/DataTable';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
}

const Products: React.FC = () => {
    const { searchTerm, pageSize } = useAppContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [activeTab, setActiveTab] = useState<'ALL' | 'Laptops'>('ALL');
    const { data, loading, error, fetchData } = useApi<Product>('products');

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns: { key: keyof Product; label: string }[] = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price' },
        { key: 'brand', label: 'Brand' },
        { key: 'category', label: 'Category' },
    ];

    const filterFields = useMemo(() => {
        const brands = Array.from(new Set(data.map((product) => product.brand)));
        const categories = Array.from(new Set(data.map((product) => product.category)));
        return [
            { key: 'title', label: 'Title' },
            { key: 'brand', label: 'Brand', options: brands },
            { key: 'category', label: 'Category', options: categories },
        ];
    }, [data]);

    const filteredData = useMemo(() => {
        return data.filter((product) => {
            // Apply tab filter
            const matchesTab = activeTab === 'ALL' || product.category.toLowerCase() === 'laptops';

            // Apply search term
            const matchesSearch = columns.some((column) => {
                const value = product[column.key];
                return (
                    value !== undefined &&
                    value !== null &&
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                );
            });

            // Apply filters
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                const productValue = product[key as keyof Product];
                return productValue !== undefined && productValue.toString() === value;
            });

            return matchesTab && matchesSearch && matchesFilters;
        });
    }, [data, searchTerm, columns, filters, activeTab]);

    const totalFilteredPages = Math.ceil(filteredData.length / pageSize);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters, activeTab]);

    return (
        <div className="products-page">
            <h1>Products</h1>
            <div>
                <button
                    onClick={() => {
                        setActiveTab('ALL');
                        setCurrentPage(1);
                    }}
                    disabled={activeTab === 'ALL'}
                >
                    ALL
                </button>
                <button
                    onClick={() => {
                        setActiveTab('Laptops');
                        setCurrentPage(1);
                    }}
                    disabled={activeTab === 'Laptops'}
                >
                    Laptops
                </button>
            </div>
            <Filters
                fields={filterFields}
                onFilterChange={(newFilters) => {
                    setFilters(newFilters);
                    setCurrentPage(1); // Reset to first page when filters change
                }}
            />
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <>
                    <DataTable data={paginatedData} columns={columns} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalFilteredPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default Products;