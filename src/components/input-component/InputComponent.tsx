import { StateLayer } from '../../assets/svg/icons/state-layer';
import styles from './InputComponent.module.css';

interface InputComponentProps {
    type: string;
    label: string;
    placeholder?: string;
}

export const InputComponent = (props: InputComponentProps) => {
    return (
        <div className={styles.inputContainer}>
            <span className={styles.backgroundLayer}>
                <label htmlFor={props.label} className={styles.label}>
                    {props.label}
                </label>
                <input
                    type={props.type}
                    id={props.label}
                    className={styles.input}
                    placeholder={props.placeholder}
                />
            </span>
            <StateLayer />
        </div>
    );
};
