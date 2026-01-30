export const normalizeRow = (
    row: Record<string, string>
): Record<string, string> => {
    const normalized: Record<string, string> = {};
    for (const key in row) {
        const value = row[key];
        if (typeof value === 'string') {
            normalized[key] = value
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .trim();
        } else {
            normalized[key] = value;
        }
    }
    return normalized;
};

export const normalizeKey = (value: string) =>
    value
        .toString()
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
