import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from '../Pagination';

describe('Pagination Component', () => {
    test('renders correct number of page buttons', () => {
        render(<Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />);

        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    test('calls onPageChange with correct page number', () => {
        const onPageChange = jest.fn();
        render(<Pagination currentPage={1} totalPages={5} onPageChange={onPageChange} />);

        fireEvent.click(screen.getByText('3'));

        expect(onPageChange).toHaveBeenCalledWith(3);
    });
});