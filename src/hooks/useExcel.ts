import { useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';

export const useExcel = (
    sheet: XLSX.WorkSheet | null,
    expectedColumns: string[],
    onSuccess?: () => void
) => {
    const result = useMemo(() => {
        if (!sheet) {
            return { data: [], columns: [] };
        }

        const [headerRow] = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            blankrows: false,
        }) as string[][];

        if (!headerRow || headerRow.length === 0) {
            throw new Error('El archivo Excel no tiene encabezados');
        }

        const normalizedExcelColumns = headerRow.map((col) =>
            col?.toString().trim().toLowerCase()
        );

        const normalizedExpectedColumns = expectedColumns.map((col) =>
            col.trim().toLowerCase()
        );

        const columnsAreValid =
            normalizedExcelColumns.length ===
                normalizedExpectedColumns.length &&
            normalizedExcelColumns.every(
                (col, index) => col === normalizedExpectedColumns[index]
            );

        if (!columnsAreValid) {
            throw new Error(
                'Columnas incorrectas. Revisa que el Excel tenga las columnas esperadas.'
            );
        }

        return {
            data: XLSX.utils.sheet_to_json(sheet),
            columns: headerRow,
        };
    }, [sheet, expectedColumns]);

    useEffect(() => {
        if (sheet) {
            onSuccess?.();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sheet]);

    return result;
};
