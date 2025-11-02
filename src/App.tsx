import './App.css';
import { HeaderComponent } from './components/header-component/HeaderComponent';
import { InputComponent } from './components/input-component/InputComponent';
import { LoginView } from './pages';

function App() {
    return (
        <>
            <HeaderComponent />
            <InputComponent
                type="text"
                label="Input"
                placeholder="Enter text here"
            />
            <LoginView />
        </>
    );
}

export default App;
    