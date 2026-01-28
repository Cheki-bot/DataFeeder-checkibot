import { type ChangeEvent, useState } from 'react';
import * as XLSX from 'xlsx';

interface ExcelOptions<T> {
    requiredColumns: string[];
    onSuccess?: (data: T[]) => Promise<void> | void;
    onError?: (message: string) => void;
}

export const useExcel = <T>({
    requiredColumns,
    onSuccess,
    onError,
}: ExcelOptions<T>) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const data = new Uint8Array(
                    event.target?.result as ArrayBuffer
                );
                const workbook = XLSX.read(data, { type: 'array' });
                const sheet = workbook.Sheets[workbook.SheetNames[0]];
                const json = XLSX.utils.sheet_to_json<T>(sheet);

                if (json.length === 0) throw new Error('El archivo está vacío');

                // Validación y Normalización de columnas
                const normalizedData = json.map((row) => {
                    const obj: Partial<T> = {};
                    requiredColumns.forEach((col) => {
                        const key = Object.keys(
                            row as Record<string, unknown>
                        ).find((k) => k.toLowerCase() === col.toLowerCase());
                        if (!key)
                            throw new Error(
                                `Columna requerida no encontrada: ${col}`
                            );
                        (obj as Record<string, unknown>)[col] =
                            row[key as keyof typeof row];
                    });
                    return obj as T;
                });

                if (onSuccess) await onSuccess(normalizedData);
            } catch (err: unknown) {
                if (onError) onError((err as Error).message);
            } finally {
                setIsLoading(false);
                e.target.value = ''; // Reset para permitir subir el mismo archivo
            }
        };
        reader.readAsArrayBuffer(file);
    };

    // El "Register" que inyecta props al input
    const registerExcel = () => ({
        type: 'file' as const,
        accept: '.xlsx, .xls, .csv',
        onChange: handleFile,
        style: { display: 'none' as const }, // Lo mantenemos oculto por defecto
    });

    return { registerExcel, isLoading };
};
