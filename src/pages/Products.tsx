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
    const { data, loading, error, totalPages, fetchData } = useApi<Product>('products');

    useEffect(() => {
        fetchData(currentPage, { ...filters, ...(activeTab === 'Laptops' ? { category: 'laptops' } : {}) });
    }, [currentPage, filters, activeTab, fetchData]);

    const columns: { key: keyof Product; label: string }[] = [
        { key: 'id', label: 'ID' },
        { key: 'title', label: 'Title' },
        { key: 'description', label: 'Description' },
        { key: 'price', label: 'Price' },
        { key: 'brand', label: 'Brand' },
        { key: 'category', label: 'Category' },
    ];

    const filterFields = useMemo(() => [
        { key: 'title', label: 'Title', options: Array.from(new Set(data.map(product => product.title))) },
        { key: 'brand', label: 'Brand', options: Array.from(new Set(data.map(product => product.brand))) },
        { key: 'category', label: 'Category', options: Array.from(new Set(data.map(product => product.category))) },
    ], [data]);

    const filteredData = useMemo(() => {
        return data.filter(product =>
            Object.entries(product).some(([key, value]) =>
                columns.map(col => col.key).includes(key as keyof Product) &&
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [data, searchTerm, columns]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    const totalFilteredPages = Math.ceil(filteredData.length / pageSize);

    return (
        <div className="products-page">
            <h1>Products</h1>
            <div>
                <button onClick={() => setActiveTab('ALL')} disabled={activeTab === 'ALL'}>ALL</button>
                <button onClick={() => setActiveTab('Laptops')} disabled={activeTab === 'Laptops'}>Laptops</button>
            </div>
            <Filters fields={filterFields} onFilterChange={setFilters} />
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