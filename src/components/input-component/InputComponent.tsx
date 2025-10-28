import { useState } from 'react';
import { StateLayer } from '../../assets/svg/icons/state-layer';
import SelectComponent from '../select-component/SelectComponent';
import styles from './InputComponent.module.css';

interface InputComponentProps {
    type: 'text' | 'email' | 'password' | 'select' | 'number' | 'date';
    label: string;
    placeholder?: string;
    options?: string[];
}

export const InputComponent = (props: InputComponentProps) => {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState('');

    return (
        <>
            {props.type === 'select' ? (
                <SelectComponent label={props.label} options={props.options} />
            ) : (
                <div className={styles.inputContainer}>
                    <div
                        className={`${styles.backgroundLayer} ${
                            focused || value ? styles.active : ''
                        }`}
                    >
                        <label htmlFor={props.label} className={styles.label}>
                            {props.label}
                        </label>
                        <input
                            type={props.type}
                            id={props.label}
                            className={styles.input}
                            placeholder={props.placeholder}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onFocus={() => setFocused(true)}
                            onBlur={() => setFocused(false)}
                        />
                    </div>
                    <StateLayer />
                </div>
            )}
        </>
    );
};
