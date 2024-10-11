import React from 'react';

interface DataTableProps<T> {
    data: T[];
    columns: { key: keyof T; label: string }[];
}

const DataTable = <T extends Record<string, any>>({ data, columns }: DataTableProps<T>) => {
    return (
        <table className="data-table">
            <thead>
            <tr>
                {columns.map((column) => (
                    <th key={column.key as string}>{column.label}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                    {columns.map((column) => (
                        <td key={`${index}-${column.key as string}`}>
                            {String(item[column.key])}
                        </td>
                    ))}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default DataTable;