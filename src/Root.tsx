import { Outlet, useLocation } from 'react-router-dom';
import { HeaderComponent } from './components';

export const Root = () => {
    const location = useLocation();

    const headerType = location.pathname === '/login' ? 'simple' : 'logged';

    return (
        <>
            <HeaderComponent type={headerType} />
            <Outlet />
        </>
    );
};