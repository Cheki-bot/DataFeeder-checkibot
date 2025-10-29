import React, { useEffect, useState } from 'react';
import { StateLayer } from '../../assets/svg/icons/state-layer';
import SelectComponent from '../select-component/SelectComponent';
import styles from './InputComponent.module.css';

interface InputComponentProps {
    type: 'text' | 'email' | 'password' | 'select' | 'number' | 'date';
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    id?: string;
    name?: string;
    required?: boolean;
    options?: string[];
}

export const InputComponent: React.FC<InputComponentProps> = (props) => {
    const {
        type,
        label,
        placeholder,
        value: controlledValue,
        onChange,
        onKeyDown,
        id,
        name,
        required,
        options,
    } = props;

    const inputId = id ?? label;

    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState<string>(
        controlledValue ?? ''
    );

    useEffect(() => {
        if (controlledValue !== undefined) {
            setInternalValue(controlledValue);
        }
    }, [controlledValue]);

    const currentValue =
        controlledValue !== undefined ? controlledValue : internalValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (controlledValue === undefined) {
            setInternalValue(e.target.value);
        }
        onChange?.(e);
    };

    const clearValue = () => {
        if (controlledValue !== undefined) {
            onChange?.({
                target: { value: '' },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
        } else {
            setInternalValue('');
        }
    };

    if (type === 'select') {
        return <SelectComponent label={label} options={options} />;
    }

    return (
        <div className={styles.inputContainer}>
            <div
                className={`${styles.backgroundLayer} ${
                    focused || currentValue ? styles.active : ''
                }`}
            >
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
                <input
                    type={type}
                    id={inputId}
                    name={name}
                    className={styles.input}
                    placeholder={placeholder}
                    value={currentValue}
                    onChange={handleChange}
                    onKeyDown={onKeyDown}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    required={required}
                />
            </div>

            {currentValue ? (
                <span
                    className={styles.clearIcon}
                    onClick={clearValue}
                    role="button"
                    aria-label={`Clear ${label}`}
                >
                    <StateLayer />
                </span>
            ) : (
                <StateLayer />
            )}
        </div>
    );
};

export default InputComponent;
