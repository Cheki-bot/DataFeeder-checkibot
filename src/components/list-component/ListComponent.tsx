import { useEffect, useState } from 'react';
import style from './ListComponent.module.css';
import { ItemList } from './components/ItemList';

type Item = {
    label: string;
    subLabel?: string;
}

type ListComponentProps = {
    items: Item[];
    onSelectionChange?: (selectedItems: Item[]) => void;
};

export const ListComponent = ({
    items,
    onSelectionChange,
}: ListComponentProps) => {
    const [checkedItems, setCheckedItems] = useState(
        new Array(items.length).fill(false)
    );

    const handleChange = (index: number, value: boolean) => {
        const newChecked = [...checkedItems];
        newChecked[index] = value;
        setCheckedItems(newChecked);
    };

    useEffect(() => {
        if (onSelectionChange) {
            const selectedItems = items.filter(
                (_, index) => checkedItems[index]
            );
            onSelectionChange(selectedItems);
          }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [checkedItems, onSelectionChange]);

    return (
        <div className={style.container}>
            <ul className={style.list}>
                {items.map((item, index) => (
                    <ItemList
                        key={index}
                        label={item.label}
                        checked={checkedItems[index]}
                        onChange={(value) => handleChange(index, value)}
                    />
                ))}
            </ul>
        </div>
    );
};
