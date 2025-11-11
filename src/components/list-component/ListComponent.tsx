import { useEffect, useState } from 'react';
import style from './ListComponent.module.css';
import { ItemList } from './components/ItemList';

type ListComponentProps = {
    items: string[];
    onSelectionChange?: (selectedItems: string[]) => void;
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
    }, [checkedItems, items, onSelectionChange]);

    return (
        <div className={style.container}>
            <ul className={style.list}>
                {items.map((item, index) => (
                    <ItemList
                        key={index}
                        label={item}
                        checked={checkedItems[index]}
                        onChange={(value) => handleChange(index, value)}
                    />
                ))}
            </ul>
        </div>
    );
};
