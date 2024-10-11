import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filters, { FilterField } from '../Filters';
import { AppProvider } from '../../contexts/AppContext';

interface TestData {
    name: string;
    gender: string;
}

const filterFields: FilterField<TestData>[] = [
    { key: 'name', label: 'Name', exact: false },
    { key: 'gender', label: 'Gender', options: ['male', 'female'], exact: true },
];

describe('Filters Component', () => {
    test('renders filter buttons', () => {
        render(
            <AppProvider>
                <Filters fields={filterFields} onFilterChange={() => {}} />
            </AppProvider>
        );

        expect(screen.getByText('Name ▼')).toBeInTheDocument();
        expect(screen.getByText('Gender ▼')).toBeInTheDocument();
    });

    test('opens text input when clicking on text filter', () => {
        render(
            <AppProvider>
                <Filters fields={filterFields} onFilterChange={() => {}} />
            </AppProvider>
        );

        fireEvent.click(screen.getByText('Name ▼'));
        expect(screen.getByPlaceholderText('Filter by Name')).toBeInTheDocument();
    });

    test('opens options when clicking on option filter', () => {
        render(
            <AppProvider>
                <Filters fields={filterFields} onFilterChange={() => {}} />
            </AppProvider>
        );

        fireEvent.click(screen.getByText('Gender ▼'));
        expect(screen.getByText('male')).toBeInTheDocument();
        expect(screen.getByText('female')).toBeInTheDocument();
    });

    test('calls onFilterChange with correct value for text filter', () => {
        const onFilterChange = jest.fn();
        render(
            <AppProvider>
                <Filters fields={filterFields} onFilterChange={onFilterChange} />
            </AppProvider>
        );

        fireEvent.click(screen.getByText('Name ▼'));
        fireEvent.change(screen.getByPlaceholderText('Filter by Name'), { target: { value: 'John' } });

        expect(onFilterChange).toHaveBeenCalledWith({ name: 'John' });
    });

    test('calls onFilterChange with correct value for option filter', () => {
        const onFilterChange = jest.fn();
        render(
            <AppProvider>
                <Filters fields={filterFields} onFilterChange={onFilterChange} />
            </AppProvider>
        );

        fireEvent.click(screen.getByText('Gender ▼'));
        fireEvent.click(screen.getByText('male'));

        expect(onFilterChange).toHaveBeenCalledWith({ gender: 'male' });
    });
});