import { CustomCheckbox } from '@/lib/shared/ui/custom-checkbox';
import style from './ItemList.module.css';

type ItemListProps = {
    label?: string;
    checked?: boolean;
    onChange?: (checked: boolean) => void;
};

export const ItemList = ({
    label,
    checked = false,
    onChange,
}: ItemListProps) => {
    return (
        <li className={style.item}>
            <p className={style.itemText}>{label}</p>
            <CustomCheckbox checked={checked} onChange={onChange} />
        </li>
    );
};
