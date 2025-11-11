import { useMemo, useState, useEffect } from "react";
import style from './ListComponent.module.css';
import { ItemList } from "./components/ItemList";

type ListItem = { id: string; label: string };

type ListComponentProps = {
  items: Array<string | ListItem>;
  multiple?: boolean;
  selectedIds?: string[];
  onChangeSelected?: (ids: string[]) => void;
};

export const ListComponent = ({ items, multiple = false, selectedIds, onChangeSelected }: ListComponentProps) => {
  const normalized: ListItem[] = useMemo(() => {
    return items.map((item, index) =>
      typeof item === 'string'
        ? { id: String(index), label: item }
        : item
    );
  }, [items]);

  const [internalSelected, setInternalSelected] = useState<string[]>([]);

  useEffect(() => {
    setInternalSelected((prev) => prev.filter((id) => normalized.some((it) => it.id === id)));
  }, [normalized]);

  const selected = selectedIds ?? internalSelected;

  const handleChange = (index: number, value: boolean) => {
    const id = normalized[index].id;
    let next: string[] = [];
    if (multiple) {
      const set = new Set(selected);
      if (value) set.add(id); else set.delete(id);
      next = Array.from(set);
    } else {
      next = value ? [id] : [];
    }

    onChangeSelected?.(next);
    if (selectedIds === undefined) {
      setInternalSelected(next);
    }
  };

  return (
    <div className={style.container}>
      <ul className={style.list}>
        {normalized.map((item, index) => (
          <ItemList
            key={item.id}
            label={item.label}
            checked={selected.includes(item.id)}
            onChange={(value) => handleChange(index, value)}
          />
        ))}
      </ul>
    </div>
  );
};
