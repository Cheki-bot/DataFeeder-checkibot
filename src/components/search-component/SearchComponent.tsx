import { useSearch } from '@/hooks/useSearch';

import styles from './SearchComponent.module.css';
import { useEffect } from 'react';

interface Item {
    [key: string]: unknown;
    id?: number;
    name?: string;
}

interface SearchComponentProps {
    data: Item[];
    searchKeys: string[];
    onResultsChange?: (results: Item[]) => void;
    hasDropdown?: boolean;
}

export const SearchComponent = ({
    data = [],
    searchKeys,
    onResultsChange,
    hasDropdown,
}: SearchComponentProps) => {
    const { query, results, handleSearch } = useSearch({
        data,
        searchKeys,
        initialQuery: '',
    });

    useEffect(() => {
        if (onResultsChange && query.length > 0) {
            onResultsChange(results);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    return (
        <article className={styles.searchComponent}>
            <input
                className={styles.input}
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
            />
            {hasDropdown && results.length > 0 && query.length > 0 && (
                <ul className={styles.resultsList}>
                    {results.map((item, index) => {
                        return (
                            <li
                                className={styles.resultItem}
                                key={item.id ?? index}
                            >
                                {searchKeys
                                    .map((key) =>
                                        item[key] !== undefined
                                            ? String(item[key])
                                            : ''
                                    )
                                    .filter(Boolean)
                                    .join(' - ')}
                            </li>
                        );
                    })}
                </ul>
            )}
        </article>
    );
};
