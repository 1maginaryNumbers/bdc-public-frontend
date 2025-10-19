import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-gray-900 hover:text-orange-600 transition-colors">
                Vihara BDC
              </Link>
            </div>
            <div className="flex items-center space-x-8">
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
          </div>
        </div>
      </nav>

      <main>
        {children}
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Vihara Buddhayana Dharmawira Centre</h3>
              <p className="text-gray-300 mb-4">
                Komunitas Buddha yang berdedikasi untuk melayani Dharma dan sesama.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-300">
                <p>Jl. Vihara No. 123, Kota</p>
                <p>(021) 1234-5678</p>
                <p>info@viharabdc.com</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Jadwal Puja</h4>
              <div className="space-y-2 text-gray-300">
                <p>Minggu: 08.00, 10.00, 19.00</p>
                <p>Harian: 06.00, 18.00</p>
                <p>Sabtu: 18.00</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Ikuti Kami</h4>
              <div className="space-y-2 text-gray-300">
                <p>Facebook: Vihara BDC</p>
                <p>Instagram: @viharabdc</p>
                <p>YouTube: Vihara BDC Channel</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Vihara Buddhayana Dharmawira Centre. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
