import React from 'react';
import { FaBuilding } from 'react-icons/fa';

const Home = () => {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      textAlign: 'center',
      background: '#f8fafc', /* Çok açık gri arka plan */
      padding: '20px',
      color: '#334155'
    }}>
      <div style={{ 
        fontSize: '4rem', 
        color: '#2563eb', 
        marginBottom: '20px',
        background: '#dbeafe', /* İkon arkasına hafif mavi daire */
        width: '120px',
        height: '120px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%'
      }}>
        <FaBuilding />
      </div>
      
      <h1 style={{ 
        fontSize: '2.5rem', 
        color: '#1e293b', 
        marginBottom: '15px', 
        fontWeight: '700' 
      }}>Hoşgeldiniz</h1>
      
      <p style={{ 
        color: '#64748b', 
        maxWidth: '600px', 
        lineHeight: '1.6',
        fontSize: '1.1rem'
      }}>
        Bu sayfaya doğrudan erişim sağlanamamaktadır. 
        <br />
        Lütfen iş yerinizden veya yöneticinizden size gönderilen 
        <strong style={{color: '#2563eb'}}> davet linkini (e-posta veya SMS)</strong> kullanarak kayıt işlemini başlatınız.
      </p>
    </div>
  );
};

export default Home;