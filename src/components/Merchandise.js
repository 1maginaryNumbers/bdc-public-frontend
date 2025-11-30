import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://finalbackend-ochre.vercel.app';

const Merchandise = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    namaPembeli: '',
    email: '',
    nomorTelepon: '',
    jumlah: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
    
    const isProduction = process.env.REACT_APP_MIDTRANS_IS_PRODUCTION === 'true';
    const scriptUrl = isProduction 
      ? 'https://app.midtrans.com/snap/snap.js'
      : 'https://app.sandbox.midtrans.com/snap/snap.js';
    
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.setAttribute('data-client-key', process.env.REACT_APP_MIDTRANS_CLIENT_KEY || '');
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/api/merchandise`);
      const data = await response.json();
      
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

  const handleBuyClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      namaPembeli: '',
      email: '',
      nomorTelepon: '',
      jumlah: 1
    });
    setShowPurchaseModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jumlah' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.namaPembeli || !formData.jumlah || formData.jumlah < 1) {
      alert('Mohon lengkapi semua field yang wajib diisi.');
      return;
    }

    if (selectedProduct.stok < formData.jumlah) {
      alert('Stok tidak mencukupi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/merchandise-transaksi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          merchandise: selectedProduct._id,
          namaPembeli: formData.namaPembeli,
          email: formData.email || undefined,
          nomorTelepon: formData.nomorTelepon || undefined,
          jumlah: formData.jumlah
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create transaction');
      }

      if (data.token && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function(result) {
            alert('Terima kasih! Pembayaran Anda berhasil. Pesanan Anda sedang diproses.');
            setShowPurchaseModal(false);
            setSelectedProduct(null);
            fetchProducts();
          },
          onPending: function(result) {
            alert('Pembayaran Anda sedang diproses. Mohon selesaikan pembayaran.');
            setShowPurchaseModal(false);
            setSelectedProduct(null);
            fetchProducts();
          },
          onError: function(result) {
            alert('Pembayaran gagal. Silakan coba lagi.');
          },
          onClose: function() {
            alert('Pembayaran dibatalkan.');
          }
        });
      } else {
        throw new Error('Payment gateway not available');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    return selectedProduct.harga * formData.jumlah;
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
                    src={product.gambar.startsWith('data:') ? product.gambar : `${API_URL}${product.gambar}`}
                    alt={product.nama}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.nextSibling) {
                        e.target.nextSibling.style.display = 'block';
                      }
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
                    {product.status === 'tersedia' ? `Tersedia (${product.stok || 0})` : 'Habis'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(product.harga)}
                  </span>
                  <button 
                    onClick={() => handleBuyClick(product)}
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
      </div>

      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Beli {selectedProduct.nama}</h3>
              <button
                onClick={() => {
                  setShowPurchaseModal(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4 mb-2">
                {selectedProduct.gambar && (
                  <img
                    src={selectedProduct.gambar.startsWith('data:') ? selectedProduct.gambar : `${API_URL}${selectedProduct.gambar}`}
                    alt={selectedProduct.nama}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-semibold">{selectedProduct.nama}</p>
                  <p className="text-sm text-gray-600">{formatCurrency(selectedProduct.harga)} per item</p>
                  <p className="text-xs text-gray-500">Stok: {selectedProduct.stok}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="namaPembeli"
                  value={formData.namaPembeli}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="nomorTelepon"
                  value={formData.nomorTelepon}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah *
                </label>
                <input
                  type="number"
                  name="jumlah"
                  value={formData.jumlah}
                  onChange={handleInputChange}
                  min="1"
                  max={selectedProduct.stok}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Maksimal: {selectedProduct.stok} item
                </p>
              </div>

              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Catatan:</strong> Barang harus diambil langsung di Vihara BDC dengan menunjukkan kuitansi pembayaran.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Harga per item:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(selectedProduct.harga)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Jumlah:</span>
                  <span className="font-semibold text-gray-900">{formData.jumlah} item</span>
                </div>
                <div className="flex justify-between items-center mb-2 pt-2 border-t border-orange-200">
                  <span className="text-sm text-gray-600">Subtotal:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(selectedProduct.harga * formData.jumlah)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-orange-300">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-lg font-bold text-orange-600">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || formData.jumlah > selectedProduct.stok}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isSubmitting || formData.jumlah > selectedProduct.stok
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-orange-600 hover:bg-orange-700'
                } text-white`}
              >
                {isSubmitting ? 'Memproses...' : 'Lanjutkan Pembayaran'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Merchandise;
