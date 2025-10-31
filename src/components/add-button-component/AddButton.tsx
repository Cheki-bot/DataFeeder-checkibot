import PlusIcon from '@/assets/svg/icons/plus-icon';
import { ButtonComponent } from '../button-component/ButtonComponent';

import style from './AddButton.module.css';

interface AddButtonProps {
    onClick?: () => void;
}

export const AddButton = ({ onClick }: AddButtonProps) => {
    return (
        <div className={style.addButton} onClick={onClick}>
            <ButtonComponent onlyIcon>
                <PlusIcon stroke='white'/>
            </ButtonComponent>
        </div>
    );
};
