import * as xlsx from 'xlsx';

/**
 * Generates and downloads an Excel template file with the given column headers.
 * @param headers - Array of column header names for the first row.
 * @param fileName - Name for the downloaded file (without extension).
 */
export const downloadExcelTemplate = (
    headers: string[],
    fileName = 'plantilla'
): void => {
    const worksheet = xlsx.utils.aoa_to_sheet([headers]);

    const colWidths = headers.map((header) => ({
        wch: Math.max(header.length + 4, 16),
    }));
    worksheet['!cols'] = colWidths;

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Plantilla');

    xlsx.writeFile(workbook, `${fileName}.xlsx`);
};
