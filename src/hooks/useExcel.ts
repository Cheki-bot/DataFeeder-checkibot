import { useState, type ChangeEvent } from 'react';
import * as XLSX from 'xlsx';

export const useExcel = <T>() => {
    const [data, setData] = useState<T[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const buffer = e.target?.result;
                const workbook = XLSX.read(buffer, { type: 'array' });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];

                const jsonData = XLSX.utils.sheet_to_json<T>(worksheet);

                if (jsonData.length > 0) {
                    setColumns(Object.keys(jsonData[0] as object));
                }

                setData(jsonData);
            } catch (error) {
                console.error('Error procesando Excel:', error);
            } finally {
                setIsLoading(false);
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return { data, columns, handleFileUpload, isLoading, setData };
};
