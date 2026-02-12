import { useState } from 'react';
import { useNavigate } from 'react-router';

import style from './ProfileComponent.module.css';
import { useAuth } from '@/contexts/auth-context/useAuth';

interface MenuOption {
    label: string;
    action: () => void;
}

interface DropdownMenuProps {
    options: MenuOption[];
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DropdownMenu = ({ options, setIsMenuOpen }: DropdownMenuProps) => {
    return (
        <div className={style.menu}>
            {options.map((option: MenuOption, index: number) => (
                <button
                    key={index}
                    className={style.menuItem}
                    onClick={() => {
                        option.action();
                        setIsMenuOpen(false);
                    }}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export const ProfileComponent = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
    };
    
    return (
        <div className={style.profileComponent}>
            <span onClick={() => setIsMenuOpen(!isMenuOpen)}>Perfil</span>
            {isMenuOpen && (
                <DropdownMenu
                    options={[
                        {
                            label: 'Mi perfil',
                            action: () => {
                                navigate('/profile');
                            },
                        },
                        {
                            label: 'Cerrar sesión',
                            action: () => {
                                handleLogout();
                            },
                        },
                    ]}
                    setIsMenuOpen={setIsMenuOpen}
                />
            )}
        </div>
    );
};
