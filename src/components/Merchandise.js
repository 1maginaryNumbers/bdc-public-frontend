import React, { useState, useEffect } from 'react';

const Merchandise = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://finalbackend-ochre.vercel.app/api/merchandise');
      const data = await response.json();
      
      // Handle both old format (array) and new format (object with merchandise property)
      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.merchandise && Array.isArray(data.merchandise)) {
        setProducts(data.merchandise);
      } else {
        setProducts([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat merchandise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Merchandise</h1>
          <p className="text-lg text-gray-600">Produk-produk berkualitas dengan logo Vihara Buddhayana Dharmawira Centre</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 text-center">
                {product.gambar ? (
                  <img
                    src={`http://finalbackend-ochre.vercel.app${product.gambar}`}
                    alt={product.nama}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : null}
                <div className={`text-6xl mb-4 ${product.gambar ? 'hidden' : 'block'}`}>
                  🛍️
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.nama}</h3>
                <p className="text-gray-600 mb-4">{product.deskripsi}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    product.status === 'tersedia' 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {product.status === 'tersedia' ? 'Tersedia' : 'Habis'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    Rp {product.harga.toLocaleString('id-ID')}
                  </span>
                  <button 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      product.status === 'tersedia'
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    }`}
                    disabled={product.status === 'habis'}
                  >
                    {product.status === 'tersedia' ? 'Beli' : 'Habis'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada produk yang tersedia.</p>
          </div>
        )}

        <div className="mt-16 bg-orange-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Cara Pemesanan</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl mb-2">📞</div>
              <h4 className="font-semibold mb-2">Telepon</h4>
              <p className="text-sm text-gray-600">Hubungi sekretariat vihara untuk pemesanan</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl mb-2">🏪</div>
              <h4 className="font-semibold mb-2">Kunjungi</h4>
              <p className="text-sm text-gray-600">Datang langsung ke sekretariat vihara</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-3xl mb-2">📱</div>
              <h4 className="font-semibold mb-2">WhatsApp</h4>
              <p className="text-sm text-gray-600">Kirim pesan ke nomor WhatsApp vihara</p>
            </div>
          </div>
          <p className="text-gray-700">
            Semua produk dapat dipesan dengan harga yang sama. Pembayaran dapat dilakukan secara tunai atau transfer.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Merchandise;
