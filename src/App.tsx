import './App.css';
import { InputComponent } from './components/input-component/InputComponent';

function App() {
    return (
        <>
            <InputComponent
                type="text"
                label="Input"
                placeholder="Enter text here"
            />
        </>
    );
}

export default App;
