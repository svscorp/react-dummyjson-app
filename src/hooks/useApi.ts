import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = 'https://dummyjson.com';

interface ApiResponse<T> {
    total: number;
    skip: number;
    limit: number;
    [key: string]: any;
}

export const useApi = <T>(endpoint: string) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(
        async (filters: Record<string, string> = {}) => {
            setLoading(true);
            setError(null);
            try {
                let response;

                if (Object.keys(filters).length > 0) {
                    // Fetch all data to apply client-side filtering
                    response = await axios.get<ApiResponse<T>>(`${BASE_URL}/${endpoint}`, {
                        params: { limit: 100 },
                    });
                } else {
                    // Fetch all data for initial load
                    response = await axios.get<ApiResponse<T>>(`${BASE_URL}/${endpoint}`, {
                        params: { limit: 100 },
                    });
                }

                const responseData = response.data[endpoint];
                if (Array.isArray(responseData)) {
                    setData(responseData);
                } else {
                    setData([]);
                }
            } catch (err) {
                setError('Error fetching data');
            }
            setLoading(false);
        },
        [endpoint]
    );

    return { data, loading, error, fetchData };
};