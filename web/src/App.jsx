import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Anasayfa (Bilgilendirme) */}
        <Route path="/" element={<Home />} />
        
        <Route path="/register" element={<Register />} />
        
        {/* Şifre Sıfırlama */}
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;