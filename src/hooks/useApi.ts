import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAppContext } from '../contexts/AppContext';

const BASE_URL = 'https://dummyjson.com';

interface ApiResponse<T> {
    users?: T[];
    products?: T[];
    total: number;
    skip: number;
    limit: number;
}

export const useApi = <T>(endpoint: string) => {
    const { pageSize } = useAppContext();
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = useCallback(async (page: number, filters: Record<string, string> = {}) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<ApiResponse<T>>(`${BASE_URL}/${endpoint}`, {
                params: {
                    limit: pageSize,
                    skip: (page - 1) * pageSize,
                    ...filters,
                },
            });
            const responseData = response.data[endpoint as keyof Pick<ApiResponse<T>, 'users' | 'products'>];
            if (Array.isArray(responseData)) {
                setData(responseData);
            } else {
                setData([]);
            }
            setTotalPages(Math.ceil(response.data.total / pageSize));
        } catch (err) {
            setError('Error fetching data');
        }
        setLoading(false);
    }, [endpoint, pageSize]);

    return { data, loading, error, totalPages, fetchData };
};