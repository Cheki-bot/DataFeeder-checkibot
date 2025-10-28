import { useState, useRef, useEffect } from 'react';
import style from './SelectComponent.module.css';

type SelectComponentProps = {
    label?: string;
    options?: string[];
    placeholder?: string;
};

const SelectComponent = ({
    label,
    options = ['No hay opciones disponibles'],
}: SelectComponentProps) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const noOptions =
        !options ||
        options.length === 0 ||
        (options.length === 1 && options[0] === 'No hay opciones disponibles');

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

    const handleSelect = (option: string) => {
        if (noOptions) return;
        setSelected(option);
        setOpen(false);
    };

    const isActive = open || selected !== '';

    return (
        <div
            className={`${style.selectComponent} ${noOptions ? style.disabled : ''}`}
            ref={ref}
        >
            <div
                className={`${style.selectWrapper} ${isActive ? style.active : ''}`}
                onClick={() => {
                    if (!noOptions) setOpen(!open);
                }}
            >
                {label && <label className={style.label}>{label}</label>}

                <div className={style.select}>
                    <span className={!selected ? style.placeholder : ''}>
                        {selected}
                    </span>
                    <span className={style.arrow}>{open ? '▲' : '▼'}</span>
                </div>
            </div>

            {open && !noOptions && (
                <ul className={style.menu}>
                    <li
                        className={style.option}
                        onClick={() => handleSelect('')}
                    >
                        Clear Selection
                    </li>
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className={style.option}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SelectComponent;
