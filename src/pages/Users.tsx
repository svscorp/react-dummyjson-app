import React, { useState, useEffect } from 'react';
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
    const { searchTerm } = useAppContext();
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const { data, loading, error, totalPages, fetchData } = useApi<User>('users');

    useEffect(() => {
        fetchData(currentPage, filters);
    }, [currentPage, filters, fetchData]);

    const columns: { key: keyof User; label: string }[] = [
        { key: 'firstName', label: 'FIRST NAME' },
        { key: 'lastName', label: 'LAST NAME' },
        { key: 'maidenName', label: 'MAIDEN NAME' },
        { key: 'age', label: 'AGE' },
        { key: 'gender', label: 'GENDER' },
        { key: 'email', label: 'EMAIL' },
        { key: 'username', label: 'USERNAME' },
        { key: 'bloodGroup', label: 'BLOODGROUP' },
        { key: 'eyeColor', label: 'EYECOLOR' },
    ];

    const filterFields = [
        { key: 'firstName', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'gender', label: 'Gender' },
    ];

    const filteredData = data.filter(user =>
        Object.values(user).some(value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="users-page">
            <h1>Users</h1>
            <Filters fields={filterFields} onFilterChange={setFilters} />
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <>
                    <DataTable data={filteredData} columns={columns} />
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
};

export default Users;