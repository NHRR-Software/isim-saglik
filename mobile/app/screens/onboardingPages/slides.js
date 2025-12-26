// app/screens/onboardingPages/slides.js

export default [
    {
      id: '1',
      title: 'Giriş yap',
      description: 'Güvenliğiniz ve verimliliğiniz için kritik öneme sahip sağlık ve ortam verilerini anlık takip etmeye başlayın.',
      // Resim yolunu kendi asset yoluna göre güncellemelisin
      image: require('../../../assets/images/onboarding/slide1.png'), 
    },
    {
      id: '2',
      title: 'Cihazınla Eşleştir',
      description: 'Akıllı saatinizi Bluetooth ile hemen eşleştirin. Hem mobil uygulama hem de cihazınız üzerinden veri akışını başlatın.',
      image: require('../../../assets/images/onboarding/slide2.png'),
    },
    {
      id: '3',
      title: 'İş ve Kişisel Sağlığını Takip Et',
      description: 'Tüm sağlık (Nabız, SpO2, Stres) ve ortam (Isı, Nem) verilerinizi tek ekranda izleyin. Riskli durumlar ve planlanmış görevleriniz için anında bildirimler alın.',
      image: require('../../../assets/images/onboarding/slide3.png'),
    },
  ];