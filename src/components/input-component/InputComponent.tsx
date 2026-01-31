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
    disabled?: boolean;
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
        disabled,
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
    const hasValue = currentValue !== '' && currentValue !== undefined;

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
            <div
                className={`${styles.inputContainer} ${
                    errors ? styles.error : ''
                } ${disabled ? styles.disabled : ''}`}
            >
                <div
                    className={`${styles.backgroundLayer} ${
                        focused || hasValue ? styles.active : ''
                    }`}
                >
                    {type !== 'date' && (
                        <label htmlFor={inputId} className={styles.label}>
                            {label}
                            {required && <span aria-hidden="true">*</span>}
                        </label>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        name={name}
                        className={
                            type === 'date'
                                ? styles['date-input']
                                : styles.input
                        }
                        placeholder={type === 'date' ? label : placeholder}
                        value={currentValue}
                        onKeyDown={onKeyDown}
                        onFocus={() => setFocused(true)}
                        onBlur={(e) => {
                            setFocused(false);
                            rhfOnBlur?.(e);
                        }}
                        required={required}
                        disabled={disabled}
                        {...restValidation}
                    />
                </div>

                {hasValue && !disabled && onClear && (
                    <span
                        className={styles.clearIcon}
                        onClick={clearValue}
                        role="button"
                        tabIndex={0}
                        aria-label={`Clear ${label}`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                clearValue();
                            }
                        }}
                    >
                        <StateLayer />
                    </span>
                )}
            </div>
            {errors && (
                <span className={styles.error} role="alert">
                    {errors.message}
                </span>
            )}
        </div>
    );
};

export default InputComponent;
