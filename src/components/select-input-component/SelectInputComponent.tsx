import React, { useState } from 'react';
import styles from './SelectInputComponent.module.css';
import type { FieldError } from 'react-hook-form';

export interface SelectOption {
    label: string;
    value: string;
}

interface SelectInputComponentProps {
    label: string;
    options: SelectOption[];
    value?: string;
    name?: string;
    id?: string;
    disabled?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    errors?: FieldError;
}

export const SelectInputComponent: React.FC<SelectInputComponentProps> = ({
    label,
    options,
    value = '',
    name,
    id,
    disabled = false,
    onChange,
    errors,
}) => {
    const [focused, setFocused] = useState(false);
    const selectId = id ?? label;
    const isActive = focused || value !== '';

    return (
        <div className={styles.inputWrapper}>
            <label className={styles.inputContainer} htmlFor={selectId}>
                <div className={`${styles.backgroundLayer} ${isActive ? styles.active : ''}`}>
                    <span className={styles.label}>
                        {label}
                    </span>
                    <select
                        id={selectId}
                        name={name}
                        className={styles.select}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        disabled={disabled}
                    >
                        {options.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <span className={styles.arrow}>▼</span>
            </label>
            {errors && <span className={styles.error}>{errors.message}</span>}
        </div>
    );
};

export default SelectInputComponent;
