import { Outlet } from 'react-router';
import { Sidebar } from './pages/home/SideBar';
import { HeaderComponent } from './components';

import style from './Layout.module.css';

export function Layout() {
    return (
        <div className={style.mainContainer}>
            <HeaderComponent type={'logged'} />
            <div className={style.container}>
                <Sidebar />
                <main className={style.content}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
