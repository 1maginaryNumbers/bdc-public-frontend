import React, { useState } from 'react';

const AboutUs = () => {
  const [formData, setFormData] = useState({
    namaLengkap: '',
    email: '',
    nomorTelepon: '',
    kategori: '',
    kritikSaran: '',
    anonymous: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://finalbackend-ochre.vercel.app/api/saran', {
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
          status: 'pending'
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
      } else {
        alert('Terjadi kesalahan saat mengirim kritik dan saran. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Terjadi kesalahan saat mengirim kritik dan saran. Silakan coba lagi.');
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
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Vihara Buddhayana Dharmawira Centre (BDC) adalah komunitas Buddha yang berdedikasi untuk melayani Dharma dan sesama.
          </p>
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
              <p className="text-lg text-gray-600 mb-6">
                Vihara Buddhayana Dharmawira Centre didirikan pada tahun 1995 dengan tujuan untuk menyediakan tempat ibadah dan pembelajaran Buddha Dharma yang nyaman bagi umat Buddha di wilayah ini.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Sejak didirikan, vihara kami telah berkembang menjadi pusat spiritual yang tidak hanya menyediakan tempat ibadah, tetapi juga berbagai program pendidikan, sosial, dan budaya yang memperkuat pemahaman Buddha Dharma.
              </p>
              <p className="text-lg text-gray-600">
                Kami percaya bahwa Dharma harus dipraktikkan tidak hanya dalam ibadah, tetapi juga dalam kehidupan sehari-hari melalui pelayanan kepada sesama dan pengembangan karakter yang baik.
              </p>
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
                    <p className="text-gray-600">
                      Menjadi pusat spiritual Buddha yang menginspirasi umat untuk hidup dalam Dharma dan melayani sesama dengan cinta kasih.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Misi:</h4>
                    <p className="text-gray-600">
                      Menyediakan tempat ibadah, pendidikan Dharma, dan program sosial yang memperkuat pemahaman Buddha Dharma serta membangun persaudaraan dalam komunitas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">📍</span>
                  <span className="text-gray-600">Jl. Vihara Buddhayana No. 123, Jakarta</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">📞</span>
                  <span className="text-gray-600">(021) 1234-5678</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">✉️</span>
                  <span className="text-gray-600">info@viharabdc.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-3">🌐</span>
                  <span className="text-gray-600">www.viharabdc.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Jam Operasional
              </h3>
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
              
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-2">Jadwal Puja Khusus:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>• Minggu: 08.00, 10.00, 19.00</p>
                  <p>• Harian: 06.00, 18.00</p>
                  <p>• Sabtu: 18.00</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
