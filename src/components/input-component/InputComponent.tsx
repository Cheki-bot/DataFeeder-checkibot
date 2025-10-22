import { StateLayer } from '../../assets/svg/icons/state-layer';
import styles from './InputComponent.module.css';

interface InputComponentProps {
    type: string;
    label: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    id?: string;
    name?: string;
    required?: boolean;
}

export const InputComponent = (props: InputComponentProps) => {
    const { type, label, placeholder, value, onChange, id, name, required } =
        props;
    const inputId = id ?? label;
    return (
        <div className={styles.inputContainer}>
            <span className={styles.backgroundLayer}>
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                </label>
                <input
                    type={type}
                    id={inputId}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onKeyDown={props.onKeyDown}
                    required={required}
                    className={styles.input}
                    placeholder={placeholder}
                />
            </span>
            <StateLayer />
        </div>
    );
};
