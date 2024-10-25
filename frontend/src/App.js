import logo from './logo.svg';
import './App.css';
import { BrowserRouter , Routes, Route} from 'react-router-dom'; // Import necessary components
import ErrorPage from './components/ErrorPage';
import Start from './components/StartPAge';
import RegisterPage from './components/Register';
import Scene from './components/model';
import LoginPage from './components/Login';
import Home from './components/Home';

function App() {
  return (
      <div className="App">
       <BrowserRouter>
        <Routes>
        <Route  path="/" element={<Start />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/home' element={<Home />} />
        <Route path='*' element={<ErrorPage/>}></Route>
        </Routes>
       </BrowserRouter>
       {/* <Start/> */}
      </div>
    
  );
}

export default App;
