import style from './ButtonComponent.module.css';

interface ButtonComponentProps {
    label?: string;
    onClick?: () => void;
    children?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    onlyIcon?: boolean;
    danger?: boolean;
    light?: boolean;
}
export const ButtonComponent = ({
    label,
    onClick,
    children,
    type = 'button',
    onlyIcon = false,
    danger = false,
    light = false,
}: ButtonComponentProps) => {
    return (
        <button
            className={
                danger
                    ? `${style.button} ${style.danger}`
                    : onlyIcon
                      ? style.onlyIcon
                      : light
                        ? `${style.button} ${style.light}`
                        : style.button
            }
            onClick={onClick}
            type={type}
        >
            {children ? children : label}
        </button>
    );
};
