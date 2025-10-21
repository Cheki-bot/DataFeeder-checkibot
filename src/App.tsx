import './App.css';
import { HeaderComponent } from './components/header-component/HeaderComponent';
import { InputComponent } from './components/input-component/InputComponent';

function App() {
    return (
        <>
            <HeaderComponent />
            <InputComponent
                type="text"
                label="Input"
                placeholder="Enter text here"
            />
        </>
    );
}

export default App;
    