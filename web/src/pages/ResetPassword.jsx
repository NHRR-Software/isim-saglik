import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Assets
import logoImg from '../assets/logo.png'; 
import bannerLeft from '../assets/img1.png';   
import bannerCenter from '../assets/img2.png'; 
import bannerRight from '../assets/img3.png';

// --- API AYARLARI ---
// const API_BASE_URL = "http://isim-saglik-server-env.eba-dyawubcm.us-west-2.elasticbeanstalk.com";
const API_BASE_URL = "http://localhost:5187";
const ResetPassword = () => {
  const location = useLocation();
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const [formData, setFormData] = useState({
    Password: '',
    PasswordAgain: ''
  });

  // URL Hash Okuma
  useEffect(() => {
    const hash = location.hash; 
    
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      
      if (token) {
        setAccessToken(token);
      } else {
        setErrorState("Geçersiz veya eksik şifre sıfırlama bağlantısı.");
      }
    } else {
      setErrorState("Şifre sıfırlama anahtarı bulunamadı. Linki kontrol ediniz.");
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.Password !== formData.PasswordAgain) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    
    if (!accessToken) {
      alert("Token bulunamadı!");
      return;
    }

    setLoading(true);

    // API Dokümanına Uygun Payload (camelCase)
    const payload = {
      accessToken: accessToken,
      password: formData.Password,
      passwordAgain: formData.PasswordAgain
    };

    try {
      // API İsteği: /api/auth/reset-password
      const response = await axios.post(`${API_BASE_URL}/api/auth/reset-password`, payload);
      
      // Backend'den gelen isSuccess kontrolü
      if (response.data && response.data.isSuccess) {
         setIsSuccess(true);
      } else {
         const msg = response.data?.message || "Şifre sıfırlama işlemi başarısız.";
         alert(msg);
      }
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Şifre sıfırlama işlemi sırasında hata oluştu.";
      alert("Hata: " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* SOL PANEL */}
      <div className="left-panel">
        <div className="left-content">
          <div className="brand-logo">
            <img src={logoImg} alt="İşim Sağlık" style={{ height: '40px', objectFit:'contain' }} />
            <span>İşim Sağlık</span>
          </div>
          <div className="hero-text">
            <h1>Şifrenizi<br />Güvenle Yenileyin.</h1>
            <p>Hesabınıza erişim sağlamak için lütfen yeni şifrenizi belirleyiniz.</p>
          </div>
          <div className="hero-gallery">
             <img src={bannerLeft} alt="Sol" className="gallery-card card-left" />
             <img src={bannerCenter} alt="Merkez" className="gallery-card card-center" />
             <img src={bannerRight} alt="Sağ" className="gallery-card card-right" />
          </div>
        </div>
      </div>

      {/* SAĞ PANEL */}
      <div className="right-panel">
        <div className="auth-form-container">
          
          {errorState ? (
             <div style={{textAlign:'center', color:'#ef4444'}}>
                <FaExclamationCircle size={50} style={{marginBottom:'20px'}} />
                <h3>Bağlantı Hatası</h3>
                <p>{errorState}</p>
             </div>
          ) : (
            <>
              <h2 className="auth-title">Şifre Sıfırla</h2>
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input type="password" name="Password" placeholder="Yeni Şifre" className="custom-input" required onChange={handleChange} disabled={isSuccess} />
                </div>

                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input type="password" name="PasswordAgain" placeholder="Yeni Şifre Tekrar" className="custom-input" required onChange={handleChange} disabled={isSuccess} />
                </div>

                <button type="submit" className="btn-primary" disabled={loading || isSuccess}>
                  {loading ? 'İşleniyor...' : 'Şifreyi Güncelle'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>

      {/* BAŞARI MODALI */}
      {isSuccess && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FaCheckCircle size={50} color="#22c55e" style={{marginBottom: '20px'}} />
            <h3 style={{color:'#333'}}>Şifreniz Güncellendi</h3>
            <p style={{margin: '20px 0', color: '#666'}}>
                Şifreniz başarıyla değiştirildi. Mobil uygulamadan yeni şifrenizle giriş yapabilirsiniz.
            </p>
            {/* Burada butona basınca yapılacak işlem (örn: Ana sayfa) */}
            <button className="btn-primary" onClick={() => window.location.href = '/'}>
                Ana Ekrana Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;