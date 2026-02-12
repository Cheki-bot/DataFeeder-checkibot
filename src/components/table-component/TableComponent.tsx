import { ActionsMenu, type TableAction } from './components/ActionsMenu';
import styles from './TableComponent.module.css';

export type { TableAction } from './components/ActionsMenu';

export interface TableColumn<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
}

interface TableComponentProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    keyExtractor: (item: T) => string;
    actions?: TableAction<T>[];
    loading?: boolean;
    loadingMessage?: string;
    emptyMessage?: string;
}

export const TableComponent = <T,>({
    columns,
    data,
    keyExtractor,
    actions,
    loading = false,
    loadingMessage = 'Cargando...',
    emptyMessage = 'No hay datos disponibles.',
}: TableComponentProps<T>) => {
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                {loadingMessage}
            </div>
        );
    }

    if (data.length === 0) {
        return <div className={styles.emptyState}>{emptyMessage}</div>;
    }

    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key}>{col.header}</th>
                        ))}
                        {actions && actions.length > 0 && (
                            <th className={styles.actionsCell}>Acciones</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={keyExtractor(item)}>
                            {columns.map((col) => (
                                <td key={col.key}>
                                    {col.render
                                        ? col.render(item)
                                        : String((item as Record<string, unknown>)[col.key] ?? '')}
                                </td>
                            ))}
                            {actions && actions.length > 0 && (
                                <td className={styles.actionsCell}>
                                    <ActionsMenu item={item} actions={actions} />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
