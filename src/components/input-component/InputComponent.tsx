import { StateLayer } from '../../assets/svg/icons/state-layer';
import SelectComponent from '../select-component/SelectComponent';
import styles from './InputComponent.module.css';

interface InputComponentProps {
    type: 'text' | 'email' | 'password' | 'select' | 'number' | 'date';
    label: string;
    placeholder?: string;
}

export const InputComponent = (props: InputComponentProps) => {
    return (
        <div className={styles.inputContainer}>
            {props.type !== 'select' && (
                <>
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
                </>
            )}
            {props.type === 'select' && <SelectComponent />}
        </div>
    );
};
