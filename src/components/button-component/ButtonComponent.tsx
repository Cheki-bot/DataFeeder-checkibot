import style from "./ButtonComponent.module.css";

interface ButtonComponentProps {
  label?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onlyIcon?: boolean;
}

export const ButtonComponent = ({
  label,
  onClick,
  children,
  type = "button",
  onlyIcon = false,
}: ButtonComponentProps) => {
  return (
    <button
      className={onlyIcon ? style.onlyIcon : style.button}
      onClick={onClick}
      type={type}
    >
      {children ? children : label}
    </button>
  );
};
