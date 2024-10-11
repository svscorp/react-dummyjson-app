import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAppContext } from '../contexts/AppContext';
import DataTable from '../components/DataTable';
import Filters, { FilterField } from '../components/Filters';
import Pagination from '../components/Pagination';
import { useFilteredData } from '../hooks/useFilteredData';

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
    const { data, loading, error, fetchData } = useApi<Product>('products');
    const [activeTab, setActiveTab] = useState<'ALL' | 'laptops'>('ALL');

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

    const brands = Array.from(new Set(data.map((product) => product.brand).filter(Boolean)));
    const categories = Array.from(new Set(data.map((product) => product.category).filter(Boolean)));

    const filterFields: FilterField<Product>[] = [
        { key: 'title', label: 'Title', exact: false },
        { key: 'brand', label: 'Brand', options: brands, exact: true },
        { key: 'category', label: 'Category', options: categories, exact: true },
    ];

    const {
        currentPage,
        setCurrentPage,
        filters,
        setFilters,
        paginatedData,
        totalFilteredPages,
    } = useFilteredData<Product>({
        data,
        columns,
        filterFields,
        searchTerm,
        pageSize,
        activeTab: activeTab === 'ALL' ? undefined : activeTab,
        tabField: 'category',
    });

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
                        setActiveTab('laptops');
                        setCurrentPage(1);
                    }}
                    disabled={activeTab === 'laptops'}
                >
                    Laptops
                </button>
            </div>
            <Filters
                fields={filterFields}
                onFilterChange={(newFilters) => {
                    setFilters(newFilters);
                    setCurrentPage(1);
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