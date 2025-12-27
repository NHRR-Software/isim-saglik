import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaLock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Assets
import logoImg from '../assets/logo.png'; 
import bannerLeft from '../assets/img1.png';   
import bannerCenter from '../assets/img2.png'; 
import bannerRight from '../assets/img3.png';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Hata durumunu göstermek için
  const [errorState, setErrorState] = useState(null);

  const [formData, setFormData] = useState({
    Password: '',
    PasswordAgain: ''
  });

  // Sayfa yüklendiğinde URL Hash'inden Token'ı ayıkla
  useEffect(() => {
    // Örnek Hash: #access_token=eyJ...&refresh_token=...&type=recovery
    const hash = location.hash; 
    
    if (hash) {
      // '#' işaretini at ve parametreleri ayır
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

    // Backend DTO Yapısına Uygun Payload
    const payload = {
      AccessToken: accessToken,
      Password: formData.Password,
      PasswordAgain: formData.PasswordAgain
    };

    try {
      // Şifre Sıfırlama Endpoint'i
      await axios.post('https://api.isimsaglik.com/api/auth/reset-password-confirm', payload);
      
      setIsSuccess(true); // Başarılı modalını aç
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Şifre sıfırlama işlemi başarısız oldu.";
      alert("Hata: " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* SOL PANEL (Register ile aynı tasarım ama metin farklı) */}
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
          
          {/* 3'LÜ GALERİ YAPISI */}
          <div className="hero-gallery">
             <img src={bannerLeft} alt="App Sol" className="gallery-card card-left" />
             <img src={bannerCenter} alt="App Merkez" className="gallery-card card-center" />
             <img src={bannerRight} alt="App Sağ" className="gallery-card card-right" />
          </div>
        </div>
      </div>

      {/* SAĞ PANEL */}
      <div className="right-panel">
        <div className="auth-form-container">
          
          {/* Hata varsa form yerine hata göster */}
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
                  <input 
                    type="password" name="Password" placeholder="Yeni Şifre" 
                    className="custom-input" required 
                    onChange={handleChange} disabled={isSuccess}
                  />
                </div>

                <div className="input-group">
                  <FaLock className="input-icon" />
                  <input 
                    type="password" name="PasswordAgain" placeholder="Yeni Şifre Tekrar" 
                    className="custom-input" required 
                    onChange={handleChange} disabled={isSuccess}
                  />
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
            {/* Burada butona basınca belki bir yere yönlendirme yapılabilir veya modal kapanır */}
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