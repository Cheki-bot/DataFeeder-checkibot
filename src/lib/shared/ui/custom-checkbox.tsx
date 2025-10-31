import style from './custom-checkbox.module.css';

type CustomCheckboxProps = {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
};

export const CustomCheckbox = ({
    checked,
    onChange,
}: CustomCheckboxProps) => {
    return (
        <label className={style.checkboxContainer}>
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange?.(e.target.checked)}
                className={style.checkboxInput}
            />
            <span className={style.customCheckbox}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="10"
                    fill="none"
                    viewBox="0 0 12 10"
                >
                    <path
                        fill="#fff"
                        d="m4 9.4-4-4L1.4 4 4 6.6 10.6 0 12 1.4z"
                    />
                </svg>
            </span>
        </label>
    );
};
