import { useState, useRef, useEffect } from 'react';
import style from './DropdownComponent.module.css';

interface DropdownOption {
    label: string;
    value: string;
}

interface DropdownComponentProps {
    label?: string;
    options: DropdownOption[];
    placeholder?: string;
    value?: string;
    onChange: (value: string) => void;
    error?: string;
}

export const DropdownComponent = ({
    label,
    options,
    placeholder = 'Selecciona una opción',
    value,
    onChange,
    error,
}: DropdownComponentProps) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option: DropdownOption) => {
        onChange(option.value);
        setOpen(false);
    };

    return (
        <div className={style.dropdownContainer} ref={ref}>
            {label && <label className={style.label}>{label}</label>}
            <div
                className={`${style.dropdownHeader} ${open ? style.active : ''} ${error ? style.errorBorder : ''}`}
                onClick={() => setOpen(!open)}
            >
                <span className={!selectedOption ? style.placeholder : style.selected}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <span className={style.arrow}>{open ? '▲' : '▼'}</span>
            </div>

            {open && (
                <ul className={style.dropdownList}>
                    {options.length === 0 ? (
                        <li className={style.noOptions}>No hay opciones</li>
                    ) : (
                        options.map((option) => (
                            <li
                                key={option.value}
                                className={`${style.option} ${option.value === value ? style.selectedOption : ''}`}
                                onClick={() => handleSelect(option)}
                            >
                                {option.label}
                            </li>
                        ))
                    )}
                </ul>
            )}
            {error && <span className={style.errorMessage}>{error}</span>}
        </div>
    );
};
