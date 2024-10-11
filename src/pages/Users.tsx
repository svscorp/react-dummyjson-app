import React, { useState, useEffect, useMemo } from 'react';
import { useApi } from '../hooks/useApi';
import { useAppContext } from '../contexts/AppContext';
import DataTable from '../components/DataTable';
import Filters from '../components/Filters';
import Pagination from '../components/Pagination';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    maidenName: string;
    age: number;
    gender: string;
    email: string;
    username: string;
    bloodGroup: string;
    eyeColor: string;
}

const Users: React.FC = () => {
    const { searchTerm, pageSize } = useAppContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const { data, loading, error, fetchData } = useApi<User>('users');

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const columns: { key: keyof User; label: string }[] = [
        { key: 'firstName', label: 'First Name' },
        { key: 'lastName', label: 'Last Name' },
        { key: 'maidenName', label: 'Maiden Name' },
        { key: 'age', label: 'Age' },
        { key: 'gender', label: 'Gender' },
        { key: 'email', label: 'Email' },
        { key: 'username', label: 'Username' },
        { key: 'bloodGroup', label: 'Blood Group' },
        { key: 'eyeColor', label: 'Eye Color' },
    ];

    const filterFields = [
        { key: 'firstName', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'gender', label: 'Gender', options: ['male', 'female'] },
        { key: 'bloodGroup', label: 'Blood Type', options: Array.from(new Set(data.map(user => user.bloodGroup))) },
    ];

    const filteredData = useMemo(() => {
        return data.filter((user) => {
            // Apply search term
            const matchesSearch = columns.some((column) => {
                const value = user[column.key];
                return (
                    value !== undefined &&
                    value !== null &&
                    value.toString().toLowerCase().includes(searchTerm.toLowerCase())
                );
            });

            // Apply filters
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                const userValue = user[key as keyof User];
                return userValue !== undefined && userValue.toString() === value;
            });

            return matchesSearch && matchesFilters;
        });
    }, [data, searchTerm, columns, filters]);

    const totalFilteredPages = Math.ceil(filteredData.length / pageSize);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;
        return filteredData.slice(startIndex, startIndex + pageSize);
    }, [filteredData, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters]);

    return (
        <div className="users-page">
            <h1>Users</h1>
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

export default Users;