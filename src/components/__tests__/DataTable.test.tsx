import React from 'react';
import { render, screen } from '@testing-library/react';
import DataTable from '../DataTable';

interface TestData {
    id: number;
    name: string;
    age: number;
}

const columns: { key: keyof TestData; label: string }[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
];

const data: TestData[] = [
    { id: 1, name: 'John Doe', age: 30 },
    { id: 2, name: 'Jane Doe', age: 25 },
];

describe('DataTable Component', () => {
    test('renders column headers', () => {
        render(<DataTable data={data} columns={columns} />);

        expect(screen.getByText('ID')).toBeInTheDocument();
        expect(screen.getByText('Name')).toBeInTheDocument();
        expect(screen.getByText('Age')).toBeInTheDocument();
    });

    test('renders data rows', () => {
        render(<DataTable data={data} columns={columns} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
});