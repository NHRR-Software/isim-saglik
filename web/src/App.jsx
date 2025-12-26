import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import './App.css';

// Register sayfası için Token Kontrolü (?token=...)
const ProtectRegister = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return <Navigate to="/" replace />;
  }
  return <Register token={token} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Token yoksa Bilgi Ekranı */}
        <Route path="/" element={<Home />} />
        
        {/* Davet Token'ı ile Kayıt */}
        <Route path="/register" element={<ProtectRegister />} />
        
        {/* Şifre Sıfırlama Ekranı (Maildeki linkten gelir) */}
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;