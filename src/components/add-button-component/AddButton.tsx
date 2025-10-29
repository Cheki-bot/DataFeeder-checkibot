import PlusIcon from '@/assets/svg/icons/plus-icon';
import { ButtonComponent } from '../button-component/ButtonComponent';

import style from './AddButton.module.css';

export const AddButton = () => {
    return (
        <div className={style.addButton}>
            <ButtonComponent onlyIcon>
                <PlusIcon stroke='white'/>
            </ButtonComponent>
        </div>
    );
};
