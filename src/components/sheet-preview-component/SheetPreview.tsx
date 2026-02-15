import style from './SheetPreview.module.css';

interface SheetColumn {
    header: string;
    example: string;
}

interface SheetPreviewProps {
    columns: SheetColumn[];
    title?: string;
    hint?: string;
    children: React.ReactNode;
}

export const SheetPreview = ({
    columns,
    title = 'Formato esperado del archivo',
    hint = 'El archivo debe tener estas columnas en la primera fila.',
    children,
}: SheetPreviewProps) => {
    return (
        <div className={style.wrapper}>
            {children}
            <div className={style.tooltip}>
                <p className={style.title}>{title}</p>
                <table className={style.table}>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.header}>{col.header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {columns.map((col) => (
                                <td key={col.header}>{col.example}</td>
                            ))}
                        </tr>
                    </tbody>
                </table>
                {hint && <p className={style.hint}>{hint}</p>}
            </div>
        </div>
    );
};
