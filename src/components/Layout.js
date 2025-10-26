import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-lg sm:text-2xl font-bold text-gray-900 hover:text-orange-600 transition-colors">
                Vihara BDC
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
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
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-700 hover:text-gray-900 p-2"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Beranda
                </Link>
                <Link 
                  to="/tentang-kami" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/tentang-kami') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Tentang Kami
                </Link>
                <Link 
                  to="/pengumuman" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/pengumuman') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Pengumuman
                </Link>
                <Link 
                  to="/galeri" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/galeri') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Galeri
                </Link>
                <Link 
                  to="/kegiatan" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/kegiatan') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Kegiatan
                </Link>
                <Link 
                  to="/struktur" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/struktur') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Struktur
                </Link>
                <Link 
                  to="/merchandise" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/merchandise') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Merchandise
                </Link>
                <Link 
                  to="/donasi" 
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/donasi') 
                      ? 'text-orange-600 bg-orange-50' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Donasi
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg sm:text-xl font-bold mb-4">Vihara Buddhayana Dharmawira Centre</h3>
              <p className="text-sm sm:text-base text-gray-300 mb-4">
                Komunitas Buddha yang berdedikasi untuk melayani Dharma dan sesama.
              </p>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-sm sm:text-base text-gray-300">
                <p>Jl. Vihara No. 123, Kota</p>
                <p>(021) 1234-5678</p>
                <p>info@viharabdc.com</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4">Jadwal Puja</h4>
              <div className="space-y-2 text-sm sm:text-base text-gray-300">
                <p>Minggu: 08.00, 10.00, 19.00</p>
                <p>Harian: 06.00, 18.00</p>
                <p>Sabtu: 18.00</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4">Ikuti Kami</h4>
              <div className="space-y-2 text-sm sm:text-base text-gray-300">
                <p>Facebook: Vihara BDC</p>
                <p>Instagram: @viharabdc</p>
                <p>YouTube: Vihara BDC Channel</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-300">&copy; 2024 Vihara Buddhayana Dharmawira Centre. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
