import { normalizeKey } from '@/pages/verifications/utils/normalize-text';
import { useMemo, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

interface UseExcelResult {
    data: Record<string, string>[];
    columns: string[];
    message?: string; // Mensaje que se puede mostrar en notificaciones
}

export const useExcel = (
    sheet: XLSX.WorkSheet | null,
    expectedColumns: Record<string, string>
): UseExcelResult => {
    const [message, setMessage] = useState<string | undefined>();

    const result = useMemo(() => {
        if (!sheet || Object.keys(sheet).length === 0) {
            return { data: [], columns: [], success: false };
        }

        const rows = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            blankrows: false,
        }) as string[][];

        const [headerRow, ...dataRows] = rows;

        if (!headerRow || headerRow.length === 0) {
            throw new Error('El archivo Excel no tiene encabezados');
        }

        const normalizedExcelHeaders = headerRow.map(normalizeKey);
        const normalizedExpected =
            Object.values(expectedColumns).map(normalizeKey);

        const missingColumns = normalizedExpected.filter(
            (col) => !normalizedExcelHeaders.includes(col)
        );

        if (missingColumns.length > 0) {
            throw new Error(
                `Faltan columnas requeridas en el Excel: ${missingColumns.join(', ')}`
            );
        }

        const columnIndexMap: Record<number, string> = {};
        normalizedExcelHeaders.forEach((excelCol, index) => {
            const expectedEntry = Object.entries(expectedColumns).find(
                ([, expectedValue]) => normalizeKey(expectedValue) === excelCol
            );

            if (expectedEntry) {
                columnIndexMap[index] = expectedEntry[1];
            }
        });

        const data = dataRows.map((row) => {
            const obj: Record<string, string> = {};
            Object.entries(columnIndexMap).forEach(([index, key]) => {
                obj[key] = row[Number(index)] ?? '';
            });
            return obj;
        });

        return {
            data,
            columns: headerRow,
            success: true
        };
    }, [sheet, expectedColumns]);

    useEffect(() => {
        if (result.success) {
            setMessage('Archivo Excel procesado correctamente');
        }
    }, [result.success]);

    return {
        data: result.data,
        columns: result.columns,
        message
    };
};
