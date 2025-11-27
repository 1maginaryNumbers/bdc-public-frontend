import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://finalbackend-ochre.vercel.app';

const AboutUs = () => {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    nomorTelepon: '',
    kategori: '',
    kritikSaran: '',
    anonymous: false
  });
  const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: '' });
  const [captchaError, setCaptchaError] = useState('');
  const [infoUmum, setInfoUmum] = useState({
    judul: '',
    alamat: '',
    telepon: '',
    email: '',
    sejarah: '',
    visi: '',
    misi: '',
    jamOperasional: [],
    tanggalKhusus: [],
    jadwalPujaBakti: []
  });

  useEffect(() => {
    generateCaptcha();
    fetchInfoUmum();
  }, []);

  useEffect(() => {
    if (window.location.hash === '#jadwal-puja') {
      setTimeout(() => {
        const element = document.getElementById('jadwal-puja');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }, [infoUmum.jadwalPujaBakti]);

  const fetchInfoUmum = async () => {
    try {
      const response = await fetch(`${API_URL}/api/info-umum`);
      if (response.ok) {
        const data = await response.json();
        setInfoUmum({
          judul: data.judul || '',
          alamat: data.alamat || '',
          telepon: data.telepon || '',
          email: data.email || '',
          sejarah: data.sejarah || '',
          visi: data.visi || '',
          misi: data.misi || '',
          jamOperasional: data.jamOperasional || [],
          tanggalKhusus: data.tanggalKhusus || [],
          jadwalPujaBakti: data.jadwalPujaBakti || []
        });
      }
    } catch (error) {
      console.error('Error fetching info umum:', error);
    }
  };

  const formatDayName = (hari) => {
    const dayMap = {
      'senin': 'Senin',
      'selasa': 'Selasa',
      'rabu': 'Rabu',
      'kamis': 'Kamis',
      'jumat': 'Jumat',
      'sabtu': 'Sabtu',
      'minggu': 'Minggu'
    };
    return dayMap[hari] || hari;
  };

  const formatDayNames = (hariArray) => {
    if (!Array.isArray(hariArray)) {
      return formatDayName(hariArray);
    }
    if (hariArray.length === 0) return '';
    if (hariArray.length === 1) return formatDayName(hariArray[0]);
    if (hariArray.length === 7) return 'Setiap Hari';
    
    const sortedDays = hariArray.sort((a, b) => {
      const order = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
      return order.indexOf(a) - order.indexOf(b);
    });
    
    return sortedDays.map(formatDayName).join(', ');
  };

  const isTodayExceptional = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return infoUmum.tanggalKhusus.some(tanggal => {
      const date = new Date(tanggal.tanggal);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });
  };

  const getTodayExceptionalInfo = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return infoUmum.tanggalKhusus.find(tanggal => {
      const date = new Date(tanggal.tanggal);
      date.setHours(0, 0, 0, 0);
      return date.getTime() === today.getTime();
    });
  };

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha({ num1, num2, answer: '' });
    setCaptchaError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const expectedAnswer = captcha.num1 + captcha.num2;
    const userAnswer = parseInt(captcha.answer);
    
    if (userAnswer !== expectedAnswer) {
      setCaptchaError('Jawaban captcha salah. Silakan coba lagi.');
      generateCaptcha();
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/saran`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          namaLengkap: formData.anonymous ? 'Anonim' : formData.namaLengkap,
          email: formData.anonymous ? '' : formData.email,
          nomorTelepon: formData.anonymous ? '' : formData.nomorTelepon,
          kategori: formData.kategori,
          kritikSaran: formData.kritikSaran,
          status: 'pending',
          captchaAnswer: userAnswer,
          captchaSum: expectedAnswer
        }),
      });

      if (response.ok) {
        alert('Terima kasih! Kritik dan saran Anda telah berhasil dikirim.');
        setFormData({
          namaLengkap: '',
          email: '',
          nomorTelepon: '',
          kategori: '',
          kritikSaran: '',
          anonymous: false
        });
        generateCaptcha();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Terjadi kesalahan saat mengirim kritik dan saran. Silakan coba lagi.');
        generateCaptcha();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Terjadi kesalahan saat mengirim kritik dan saran. Silakan coba lagi.');
      generateCaptcha();
    }
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Tentang Kami
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Introduction Section */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Sejarah Vihara BDC
              </h2>
              {infoUmum.sejarah ? (
                <div className="text-lg text-gray-600 whitespace-pre-line">
                  {infoUmum.sejarah}
                </div>
              ) : (
                <>
                  <p className="text-lg text-gray-600 mb-6">
                    Vihara Buddhayana Dharmawira Centre didirikan pada tahun 1995 dengan tujuan untuk menyediakan tempat ibadah dan pembelajaran Buddha Dharma yang nyaman bagi umat Buddha di wilayah ini.
                  </p>
                  <p className="text-lg text-gray-600 mb-6">
                    Sejak didirikan, vihara kami telah berkembang menjadi pusat spiritual yang tidak hanya menyediakan tempat ibadah, tetapi juga berbagai program pendidikan, sosial, dan budaya yang memperkuat pemahaman Buddha Dharma.
                  </p>
                  <p className="text-lg text-gray-600">
                    Kami percaya bahwa Dharma harus dipraktikkan tidak hanya dalam ibadah, tetapi juga dalam kehidupan sehari-hari melalui pelayanan kepada sesama dan pengembangan karakter yang baik.
                  </p>
                </>
              )}
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-6xl text-white font-bold">BDC</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Visi & Misi
                </h3>
                <div className="space-y-4 text-left">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Visi:</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {infoUmum.visi || 'Menjadi pusat spiritual Buddha yang menginspirasi umat untuk hidup dalam Dharma dan melayani sesama dengan cinta kasih.'}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Misi:</h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {infoUmum.misi || 'Menyediakan tempat ibadah, pendidikan Dharma, dan program sosial yang memperkuat pemahaman Buddha Dharma serta membangun persaudaraan dalam komunitas.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Jadwal Puja Bakti Section */}
        {infoUmum.jadwalPujaBakti && infoUmum.jadwalPujaBakti.length > 0 && (
          <div id="jadwal-puja" className="mb-16 scroll-mt-20">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Jadwal Puja Bakti</h2>
              <p className="text-lg text-gray-600">Jadwal ibadah rutin di vihara kami</p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {infoUmum.jadwalPujaBakti.map((jadwal, index) => {
                  const dayNames = formatDayNames(jadwal.hari);
                  if (!dayNames) return null;
                  
                  return (
                    <div key={index} className="bg-blue-50 rounded-lg p-5 border border-blue-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center flex-1">
                          <span className="text-blue-600 mr-3 text-2xl">🕯️</span>
                          <div className="flex-1">
                            <h3 className="text-gray-900 font-semibold text-lg mb-1">{dayNames}</h3>
                            {jadwal.keterangan && (
                              <p className="text-gray-600 text-sm">{jadwal.keterangan}</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-11">
                        <p className="text-blue-700 font-bold text-xl">{jadwal.waktu}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Kritik Saran Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Kritik & Saran
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-lg text-gray-600 text-center mb-8">
                Kami menghargai setiap masukan dari umat dan pengunjung. Silakan berikan kritik dan saran Anda untuk membantu kami meningkatkan pelayanan Vihara BDC.
              </p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleInputChange}
                      required
                      disabled={formData.anonymous}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Masukkan nama lengkap Anda"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={formData.anonymous}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="contoh@email.com"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      name="nomorTelepon"
                      value={formData.nomorTelepon}
                      onChange={handleInputChange}
                      disabled={formData.anonymous}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select 
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih kategori</option>
                      <option value="pelayanan">Pelayanan</option>
                      <option value="fasilitas">Fasilitas</option>
                      <option value="kegiatan">Kegiatan</option>
                      <option value="administrasi">Administrasi</option>
                      <option value="lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kritik & Saran *
                  </label>
                  <textarea
                    name="kritikSaran"
                    value={formData.kritikSaran}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Silakan tuliskan kritik dan saran Anda di sini..."
                  ></textarea>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                    Kirim sebagai anonim
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Verifikasi Keamanan *
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
                      <span className="text-lg font-semibold text-gray-900">
                        {captcha.num1} + {captcha.num2} = ?
                      </span>
                    </div>
                    <input
                      type="number"
                      value={captcha.answer}
                      onChange={(e) => {
                        setCaptcha(prev => ({ ...prev, answer: e.target.value }));
                        setCaptchaError('');
                      }}
                      required
                      className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jawaban"
                    />
                    <button
                      type="button"
                      onClick={generateCaptcha}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      title="Refresh captcha"
                    >
                      🔄
                    </button>
                  </div>
                  {captchaError && (
                    <p className="mt-2 text-sm text-red-600">{captchaError}</p>
                  )}
                </div>
                
                <div className="text-center">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
                  >
                    Kirim Kritik & Saran
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Hubungi Kami
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Informasi Kontak
              </h3>
              <div className="space-y-3">
                {infoUmum.alamat && (
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">📍</span>
                    <span className="text-gray-600">{infoUmum.alamat}</span>
                  </div>
                )}
                {infoUmum.telepon && (
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">📞</span>
                    <span className="text-gray-600">{infoUmum.telepon}</span>
                  </div>
                )}
                {infoUmum.email && (
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">✉️</span>
                    <span className="text-gray-600">{infoUmum.email}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Jam Operasional
              </h3>
              {isTodayExceptional() && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-semibold text-sm mb-1">⚠️ Tutup Hari Ini</p>
                  {getTodayExceptionalInfo()?.keterangan && (
                    <p className="text-red-700 text-sm">{getTodayExceptionalInfo().keterangan}</p>
                  )}
                </div>
              )}
              {infoUmum.jamOperasional && infoUmum.jamOperasional.length > 0 ? (
                <div className="space-y-2">
                  {infoUmum.jamOperasional.map((jam, index) => {
                    const dayNames = formatDayNames(jam.hari);
                    if (!dayNames) return null;
                    
                    return (
                      <div key={index} className="flex justify-between">
                        <span className="text-gray-600">{dayNames}:</span>
                        {jam.tutup ? (
                          <span className="text-red-600 font-medium">Tutup</span>
                        ) : (
                          <span className="text-gray-900 font-medium">
                            {jam.jamBuka} - {jam.jamTutup}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Senin - Jumat:</span>
                    <span className="text-gray-900 font-medium">06.00 - 21.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sabtu:</span>
                    <span className="text-gray-900 font-medium">06.00 - 22.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Minggu:</span>
                    <span className="text-gray-900 font-medium">06.00 - 22.00</span>
                  </div>
                </div>
              )}
              
              {infoUmum.tanggalKhusus && infoUmum.tanggalKhusus.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">Tanggal Khusus (Tutup):</h4>
                  <div className="space-y-2 text-sm">
                    {infoUmum.tanggalKhusus.map((tanggal, index) => {
                      const date = new Date(tanggal.tanggal);
                      const formattedDate = date.toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      });
                      return (
                        <div key={index} className="flex items-start">
                          <span className="text-red-600 mr-2">📅</span>
                          <div>
                            <span className="text-gray-900 font-medium">{formattedDate}</span>
                            {tanggal.keterangan && (
                              <span className="text-gray-600 ml-2">- {tanggal.keterangan}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
