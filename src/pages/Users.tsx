import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAppContext } from '../contexts/AppContext';
import DataTable from '../components/DataTable';
import Filters, { FilterField } from '../components/Filters';
import Pagination from '../components/Pagination';
import { useFilteredData } from '../hooks/useFilteredData';

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

    const filterFields: FilterField<User>[] = [
        { key: 'name', label: 'Name', fields: ['firstName', 'lastName'], exact: false },
        { key: 'email', label: 'Email', exact: false },
        { key: 'gender', label: 'Gender', options: ['male', 'female'], exact: true },
        {
            key: 'bloodGroup',
            label: 'Blood Type',
            options: Array.from(new Set(data.map((user) => user.bloodGroup))),
            exact: true,
        },
    ];

    const {
        currentPage,
        setCurrentPage,
        filters,
        setFilters,
        paginatedData,
        totalFilteredPages,
    } = useFilteredData<User>({
        data,
        columns,
        filterFields,
        searchTerm,
        pageSize,
    });

    return (
        <div className="users-page">
            <h1>Users</h1>
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

export default Users;