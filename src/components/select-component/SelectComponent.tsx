import style from './SelectComponent.module.css';

const SelectComponent = () => {
  return (
    <div className={style.selectComponent}>
      <select className={style.select}>
        <option className={style.option} value="">Select an option</option>
        <option className={style.option} value="1">Option 1</option>
        <option className={style.option} value="2">Option 2</option>
        <option className={style.option} value="3">Option 3</option>
      </select>
    </div>
  );
};

export default SelectComponent;
