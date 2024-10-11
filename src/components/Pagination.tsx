import React, { useMemo } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = useMemo(() => {
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 4) pages.push('...');
            const startPage = Math.max(2, currentPage - 2);
            const endPage = Math.min(totalPages - 1, currentPage + 2);
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 3) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    return (
        <div className="pagination">
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
                &lt;&lt;
            </button>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                &lt;
            </button>
            {getPageNumbers.map((page, index) =>
                    typeof page === 'number' ? (
                        <button
                            key={index}
                            onClick={() => onPageChange(page)}
                            className={currentPage === page ? 'active' : ''}
                        >
                            {page}
                        </button>
                    ) : (
                        <span key={index} className="dots">
            {page}
          </span>
                    )
            )}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                &gt;
            </button>
            <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
                &gt;&gt;
            </button>
        </div>
    );
};

export default Pagination;