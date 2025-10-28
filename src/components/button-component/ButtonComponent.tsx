import style from './ButtonComponent.module.css';

interface ButtonComponentProps {
    label?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onlyIcon?: boolean;
    danger?: boolean;
}
export const ButtonComponent = ({
    label,
    onClick,
    children,
    type = 'button',
    onlyIcon = false,
    danger = false,
}: ButtonComponentProps) => {
    return (
        <button
            className={
                danger
                    ? `${style.button} ${style.danger}`
                    : onlyIcon
                    ? style.onlyIcon
                    : style.button
            }
            onClick={onClick}
            type={type}
        >
            {children ? children : label}
        </button>
    );
};
