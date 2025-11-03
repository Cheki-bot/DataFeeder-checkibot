import './App.css';
import { HeaderComponent } from './components/header-component/HeaderComponent';
import { HomeView } from './pages/home/HomeView';

function App() {
    return (
        <>
            <HeaderComponent type='simple'/>
            <HomeView />
        </>
    );
}

export default App;
    