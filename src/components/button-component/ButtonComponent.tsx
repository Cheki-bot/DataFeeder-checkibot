import style from "./ButtonComponent.module.css"

interface ButtonComponentProps {
    label: string;
    onClick?: () => void;
    children?: React.ReactNode;
    type?: "button" | "submit" | "reset";
}

export const ButtonComponent = (props: ButtonComponentProps) => {
    return (
        <button className={style.button} onClick={props.onClick} type={props.type}>
            {props.children ? props.children : props.label}
        </button>
    );
}