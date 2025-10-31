import { useState } from "react";
import style from './ListComponent.module.css';
import { ItemList } from "./components/ItemList";

type ListComponentProps = {
  items: string[];
};

export const ListComponent = ({ items }: ListComponentProps) => {
  const [checkedItems, setCheckedItems] = useState(
    new Array(items.length).fill(false)
  );

  const handleChange = (index: number, value: boolean) => {
    const newChecked = [...checkedItems];
    newChecked[index] = value;
    setCheckedItems(newChecked);
  };

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
