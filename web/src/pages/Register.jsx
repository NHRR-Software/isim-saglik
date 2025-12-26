import React, { useState } from 'react';
import axios from 'axios';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from 'date-fns/locale/tr';
import { 
  FaUser, FaPhoneAlt, FaCalendarAlt, FaLock, 
  FaCheckCircle 
} from 'react-icons/fa';

// Assets
import logoImg from '../assets/logo.png'; 
import bannerLeft from '../assets/img1.png';   
import bannerCenter from '../assets/img2.png'; 
import bannerRight from '../assets/img3.png';

registerLocale('tr', tr);

const Register = ({ token }) => {
  const [showModal, setShowModal] = useState(false); // Sözleşme modalı
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  // Başarı ve Kilit State'leri
  const [showSuccessModal, setShowSuccessModal] = useState(false); 
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

  const [formData, setFormData] = useState({
    FullName: '',
    PhoneNumber: '',
    Password: '',
    PasswordAgain: ''
  });

  const [birthDate, setBirthDate] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasyonlar
    if (!agreed) { alert("Lütfen üyelik sözleşmesini onaylayınız."); return; }
    if (formData.Password !== formData.PasswordAgain) { alert("Şifreler eşleşmiyor!"); return; }
    if (!birthDate) { alert("Lütfen doğum tarihinizi giriniz."); return; }

    setLoading(true);

    const payload = {
      InvitationToken: token,
      FullName: formData.FullName,
      Password: formData.Password,
      PasswordAgain: formData.PasswordAgain,
      PhoneNumber: formData.PhoneNumber,
      BirthDate: birthDate.toISOString(), 
      Gender: 0 
    };

    try {
      // API İsteği
      await axios.post('https://api.isimsaglik.com/api/auth/register-invite', payload);
      
      // Başarılı olursa
      setIsRegistrationComplete(true);
      setShowSuccessModal(true);
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.message || "Kayıt sırasında bir hata oluştu.";
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
            <h1>Sağlığınız<br />Tek Tıkla Dijitalde.</h1>
            <p>Akıllı saat entegrasyonu ile iş yerinde sağlığınızı anlık takip edin.</p>
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
          <h2 className="auth-title">Hesabını Oluştur</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <FaUser className="input-icon" />
              <input type="text" name="FullName" placeholder="İsminizi Giriniz" className="custom-input" required onChange={handleChange} disabled={isRegistrationComplete} />
            </div>
            <div className="input-group">
              <FaPhoneAlt className="input-icon" />
              <input type="tel" name="PhoneNumber" placeholder="Telefon Numarası" className="custom-input" required onChange={handleChange} disabled={isRegistrationComplete} />
            </div>
            <div className="input-group">
              <FaCalendarAlt className="input-icon" style={{zIndex: 10}} />
              <DatePicker selected={birthDate} onChange={(date) => setBirthDate(date)} dateFormat="dd/MM/yyyy" locale="tr" placeholderText="Doğum Tarihi (GG/AA/YYYY)" className="custom-input" required showYearDropdown scrollableYearDropdown yearDropdownItemNumber={100} disabled={isRegistrationComplete} />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input type="password" name="Password" placeholder="Şifre" className="custom-input" required onChange={handleChange} disabled={isRegistrationComplete} />
            </div>
            <div className="input-group">
              <FaLock className="input-icon" />
              <input type="password" name="PasswordAgain" placeholder="Şifre Tekrar" className="custom-input" required onChange={handleChange} disabled={isRegistrationComplete} />
            </div>
            <div className="agreement">
              <input type="checkbox" id="terms" className="checkbox-custom" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} disabled={isRegistrationComplete} />
              <label htmlFor="terms">
                <span className="link-text" onClick={() => !isRegistrationComplete && setShowModal(true)}>Hizmet Şartları ve Gizlilik Politikasını</span> okudum, onaylıyorum.
              </label>
            </div>
            <button type="submit" className="btn-primary" disabled={loading || isRegistrationComplete}>
              {loading ? 'İşleniyor...' : 'Hesap Oluştur'}
            </button>
          </form>
        </div>
      </div>

      {/* MODALLAR */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <FaCheckCircle size={50} color="#2563eb" style={{marginBottom: '20px'}} />
            <h3 style={{color:'#333'}}>Üyelik Sözleşmesi</h3>
            <div style={{textAlign:'left', margin:'20px 0', fontSize:'0.9rem', color:'#666', maxHeight:'300px', overflowY:'auto', border:'1px solid #eee', padding:'10px', borderRadius:'8px'}}>
              <p>KVKK ve Aydınlatma Metni içeriği...</p>
            </div>
            <button className="btn-primary" onClick={() => {setAgreed(true); setShowModal(false);}}>Okudum, Onaylıyorum</button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay">
            <div className="modal-content">
                <FaCheckCircle size={50} color="#22c55e" style={{marginBottom: '20px'}} />
                <h3 style={{color:'#333'}}>Hesabınız Oluşturuldu</h3>
                <p style={{margin: '20px 0', color: '#666'}}>İşim Sağlık mobil uygulamasından giriş yapabilirsiniz.</p>
                <button className="btn-primary" onClick={() => setShowSuccessModal(false)}>Tamam</button>
            </div>
        </div>
      )}
    </div>
  );
};

export default Register;