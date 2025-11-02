import './App.css';
import { HeaderComponent } from './components/header-component/HeaderComponent';
import { LoginView } from './pages';

function App() {
    return (
        <>
            <HeaderComponent type='simple'/>
            <LoginView />
        </>
    );
}

export default App;
    