import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'https://finalbackend-ochre.vercel.app';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [infoUmum, setInfoUmum] = useState({
    judul: '',
    isi: '',
    alamat: '',
    telepon: '',
    email: '',
    jamOperasional: []
  });

  useEffect(() => {
    fetchInfoUmum();
  }, []);

  const fetchInfoUmum = async () => {
    try {
      const response = await fetch(`${API_URL}/api/info-umum`);
      if (response.ok) {
        const data = await response.json();
        setInfoUmum({
          judul: data.judul || '',
          isi: data.isi || '',
          alamat: data.alamat || '',
          telepon: data.telepon || '',
          email: data.email || '',
          jamOperasional: data.jamOperasional || [],
          tanggalKhusus: data.tanggalKhusus || []
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
    
    // Try to create ranges (e.g., "Senin - Jumat")
    if (sortedDays.length >= 2) {
      const order = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
      const firstIndex = order.indexOf(sortedDays[0]);
      const lastIndex = order.indexOf(sortedDays[sortedDays.length - 1]);
      
      if (lastIndex - firstIndex + 1 === sortedDays.length) {
        // It's a consecutive range
        return `${formatDayName(sortedDays[0])} - ${formatDayName(sortedDays[sortedDays.length - 1])}`;
      }
    }
    
    return sortedDays.map(formatDayName).join(', ');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors whitespace-nowrap">
                {'Vihara BDC'}
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4 xl:space-x-6 ml-2 lg:ml-4 flex-shrink">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Beranda
              </Link>
              <Link 
                to="/tentang-kami" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/tentang-kami') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Tentang Kami
              </Link>
              <Link 
                to="/pengumuman" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/pengumuman') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Pengumuman
              </Link>
              <Link 
                to="/galeri" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/galeri') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Galeri
              </Link>
              <Link 
                to="/kegiatan" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/kegiatan') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Kegiatan
              </Link>
              <Link 
                to="/struktur" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/struktur') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Struktur
              </Link>
              <Link 
                to="/merchandise" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/merchandise') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Merchandise
              </Link>
              <Link 
                to="/donasi" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/donasi') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Donasi
              </Link>
              <Link 
                to="/paket-sumbangan" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/paket-sumbangan') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Paket Sumbangan
              </Link>
              <Link 
                to="/faq" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/faq') 
                    ? 'text-orange-600 bg-orange-50' 
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                FAQ
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-gray-900 active:text-orange-600 p-2 -mr-2 flex-shrink-0"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-3">
              <div className="flex flex-col space-y-1">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive('/') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 active:bg-gray-100'
                  }`}
                >
                  Beranda
                </Link>
                <Link 
                  to="/tentang-kami" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive('/tentang-kami') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 active:bg-gray-100'
                  }`}
                >
                  Tentang Kami
                </Link>
                <Link 
                  to="/pengumuman" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive('/pengumuman') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 active:bg-gray-100'
                  }`}
                >
                  Pengumuman
                </Link>
                <Link 
                  to="/galeri" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive('/galeri') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 active:bg-gray-100'
                  }`}
                >
                  Galeri
                </Link>
                <Link 
                  to="/kegiatan" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive('/kegiatan') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 active:bg-gray-100'
                  }`}
                >
                  Kegiatan
                </Link>
                <Link 
                  to="/struktur" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive('/struktur') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 active:bg-gray-100'
                  }`}
                >
                  Struktur
                </Link>
                <Link 
                  to="/merchandise" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive('/merchandise') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 active:bg-gray-100'
                  }`}
                >
                  Merchandise
                </Link>
                <Link 
                  to="/donasi" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive('/donasi') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 active:bg-gray-100'
                  }`}
                >
                  Donasi
                </Link>
                <Link 
                  to="/paket-sumbangan" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive('/paket-sumbangan') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 active:bg-gray-100'
                  }`}
                >
                  Paket Sumbangan
                </Link>
                <Link 
                  to="/faq" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive('/faq') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 active:bg-gray-100'
                  }`}
                >
                  FAQ
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main>
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <h4 className="text-lg font-semibold mb-5 text-white">Kontak</h4>
              <div className="space-y-3 text-sm text-gray-300">
                {infoUmum.alamat && (
                  <div className="flex items-start">
                    <span className="mr-3 text-orange-400 mt-1">📍</span>
                    <p className="leading-relaxed">{infoUmum.alamat}</p>
                  </div>
                )}
                {infoUmum.telepon && (
                  <div className="flex items-center">
                    <span className="mr-3 text-orange-400">📞</span>
                    <p>{infoUmum.telepon}</p>
                  </div>
                )}
                {infoUmum.email && (
                  <div className="flex items-center">
                    <span className="mr-3 text-orange-400">✉️</span>
                    <p>{infoUmum.email}</p>
                  </div>
                )}
                {!infoUmum.alamat && !infoUmum.telepon && !infoUmum.email && (
                  <>
                    <div className="flex items-start">
                      <span className="mr-3 text-orange-400 mt-1">📍</span>
                      <p>Jl. Vihara No. 123, Kota</p>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-orange-400">📞</span>
                      <p>(021) 1234-5678</p>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-3 text-orange-400">✉️</span>
                      <p>info@viharabdc.com</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-5 text-white">Jam Operasional</h4>
              {infoUmum.jamOperasional && infoUmum.jamOperasional.length > 0 ? (
                <div className="space-y-2.5 text-sm text-gray-300">
                  {infoUmum.jamOperasional.map((jam, index) => {
                    const dayNames = formatDayNames(jam.hari);
                    if (!dayNames) return null;
                    return (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-300">{dayNames}:</span>
                        <span className={`font-medium ${jam.tutup ? 'text-red-400' : 'text-gray-100'}`}>
                          {jam.tutup ? 'Tutup' : `${jam.jamBuka} - ${jam.jamTutup}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2.5 text-sm text-gray-300">
                  <div className="flex justify-between items-center">
                    <span>Minggu:</span>
                    <span className="text-gray-100 font-medium">08.00, 10.00, 19.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Harian:</span>
                    <span className="text-gray-100 font-medium">06.00, 18.00</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sabtu:</span>
                    <span className="text-gray-100 font-medium">18.00</span>
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-5 text-white">Ikuti Kami</h4>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-center">
                  <span className="mr-3 text-orange-400">📘</span>
                  <p>Facebook: Vihara BDC</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-orange-400">📷</span>
                  <p>Instagram: @viharabdc</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-orange-400">📺</span>
                  <p>YouTube: Vihara BDC Channel</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-10 pt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-400">&copy; 2024 Vihara Buddhayana Dharmawira Centre. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
