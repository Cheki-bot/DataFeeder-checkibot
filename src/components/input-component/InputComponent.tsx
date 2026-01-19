import React, { useEffect, useState } from 'react';
import { StateLayer } from '../../assets/svg/icons/state-layer';
import SelectComponent from '../select-component/SelectComponent';
import styles from './InputComponent.module.css';
import type { FieldError } from 'react-hook-form';

interface InputComponentProps {
    type: 'text' | 'email' | 'password' | 'select' | 'number' | 'date';
    label: string;
    options?: string[];
    placeholder?: string;
    value?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    id?: string;
    name?: string;
    required?: boolean;
    validationProps?: React.InputHTMLAttributes<HTMLInputElement>;
    errors?: FieldError;
    onClear?: () => void;
}

export const InputComponent: React.FC<InputComponentProps> = (props) => {
    const {
        type,
        label,
        placeholder,
        value,
        onKeyDown,
        id,
        name,
        required,
        options,
        errors,
        onClear,
    } = props;

    const { onBlur: rhfOnBlur, ...restValidation } =
        props.validationProps || {};

    const inputId = id ?? label;

    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState<string>(value ?? '');

    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    const currentValue = value !== undefined ? value : internalValue;

    const clearValue = () => {
        setInternalValue('');
        if (onClear) {
            onClear();
        }
    };

    if (type === 'select') {
        return <SelectComponent label={label} options={options} />;
    }

    return (
        <div className={styles.inputWrapper}>
            <div className={styles.inputContainer}>
                <div
                    className={`${styles.backgroundLayer} ${
                        focused || currentValue ? styles.active : ''
                    }`}
                >
                    {type !== 'date' && (
                        <label htmlFor={inputId} className={styles.label}>
                            {label}
                        </label>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        name={name}
                        className={type === 'date' ? styles['date-input'] : styles.input}
                        placeholder={placeholder}
                        value={currentValue}
                        onKeyDown={onKeyDown}
                        onFocus={() => setFocused(true)}
                        onBlur={(e) => {
                            console.log('no se esta focuseando xd: ', focused);
                            setFocused(false);
                            rhfOnBlur?.(e);
                        }}
                        required={required}
                        {...restValidation}
                    />
                </div>

                {value !== '' || value == undefined ? (
                    <span
                        className={styles.clearIcon}
                        onClick={clearValue}
                        role="button"
                        aria-label={`Clear ${label}`}
                    >
                        <StateLayer />
                    </span>
                ) : (
                    <></>
                )}
            </div>
            {errors && <span className={styles.error}>{errors.message}</span>}
        </div>
    );
};

export default InputComponent;
