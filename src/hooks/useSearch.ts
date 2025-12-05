import { useState, useMemo, useCallback } from 'react';

interface UseSearchOptions<T> {
  data: T[];
  searchKeys: (keyof T)[];
  initialQuery?: string;
}

export const useSearch = <T extends Record<string, unknown>>({
  data,
  searchKeys,
  initialQuery = '',
}: UseSearchOptions<T>) => {
  const [query, setQuery] = useState(initialQuery);

  const results = useMemo<T[]>(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery === '') {
      return data;
    }

    const lowerQuery = trimmedQuery.toLowerCase();

    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowerQuery);
      })
    );
  }, [data, query, searchKeys]);

  const handleSearch = useCallback((searchTerm: string) => {
    setQuery(searchTerm);
  }, []);

  return {
    query,
    results,
    handleSearch,
  };
};