import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import RegisterForm from './component/RegisterForm';
import Login from './component/Login';
// import Home from './component/Home';
import Confirmpasswoord from './component/Confirmpasswoord';
import RequestPasswordReset from './component/RequestPasswordReset';
import ResetPassword from './component/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Register Form */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/" element={<RegisterForm />} />
        {/* Route for the Login Page */}
        <Route path="/login" element={<Login />} />
        <Route path='/Change' element={<Confirmpasswoord/>}/>
        <Route path="/request-reset" element={<RequestPasswordReset />} />
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />

      </Routes>
    </Router>
  );
}

export default App;
