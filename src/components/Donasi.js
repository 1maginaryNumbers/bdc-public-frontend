import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://finalbackend-ochre.vercel.app';

const Donasi = () => {
  const [sumbangan, setSumbangan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSumbangan, setSelectedSumbangan] = useState(null);
  const [showQRISModal, setShowQRISModal] = useState(false);
  const [selectedQRIS, setSelectedQRIS] = useState(null);
  const [formData, setFormData] = useState({
    sumbangan: '',
    name: '',
    email: '',
    phone: '',
    amount: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    fetchSumbangan();
    
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

  const fetchSumbangan = async () => {
    try {
      const response = await fetch(`${API_URL}/api/sumbangan`);
      const data = await response.json();
      
      let sumbanganList = [];
      if (Array.isArray(data)) {
        sumbanganList = data;
      } else if (data.sumbangan && Array.isArray(data.sumbangan)) {
        sumbanganList = data.sumbangan;
      }
      
      const activeSumbangan = sumbanganList.filter(item => item.status === 'aktif');
      setSumbangan(activeSumbangan);
      
      if (activeSumbangan.length > 0 && !formData.sumbangan) {
        setFormData(prev => ({ ...prev, sumbangan: activeSumbangan[0]._id }));
        setSelectedSumbangan(activeSumbangan[0]);
      }
    } catch (error) {
      console.error('Error fetching donation events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'sumbangan') {
      const selected = sumbangan.find(item => item._id === value);
      setSelectedSumbangan(selected);
    }
  };

  const handleAmountClick = (amount) => {
    setFormData(prev => ({ ...prev, amount: amount.toString() }));
  };

  const getQRISImageUrl = (sumbanganId) => {
    return `${API_URL}/api/sumbangan/${sumbanganId}/qris-image`;
  };

  const openQRISModal = (sumbanganItem) => {
    setSelectedQRIS(sumbanganItem);
    setShowQRISModal(true);
  };

  const closeQRISModal = () => {
    setShowQRISModal(false);
    setSelectedQRIS(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.sumbangan || !formData.name || !formData.amount) {
      alert('Mohon lengkapi semua field yang wajib diisi.');
      return;
    }

    setIsSubmitting(true);
    setPaymentStatus(null);

    try {
      const response = await fetch(`${API_URL}/api/sumbangan/payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sumbangan: formData.sumbangan,
          namaDonatur: formData.name,
          email: formData.email || undefined,
          nomorTelepon: formData.phone || undefined,
          nominal: parseFloat(formData.amount)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create payment');
      }

      if (data.token && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: function(result) {
            setPaymentStatus('success');
            alert('Terima kasih! Pembayaran Anda berhasil.');
            setFormData({
              sumbangan: formData.sumbangan,
              name: '',
              email: '',
              phone: '',
              amount: '',
              message: ''
            });
          },
          onPending: function(result) {
            setPaymentStatus('pending');
            alert('Pembayaran Anda sedang diproses. Mohon selesaikan pembayaran.');
          },
          onError: function(result) {
            setPaymentStatus('error');
            alert('Pembayaran gagal. Silakan coba lagi.');
          },
          onClose: function() {
            setPaymentStatus('cancelled');
          }
        });
      } else {
        throw new Error('Payment gateway not available');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.');
      setPaymentStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickAmounts = [50000, 100000, 250000, 500000, 1000000];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat informasi donasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Donasi</h1>
          <p className="text-lg text-gray-600">Bantu kami dalam melayani Tuhan dan sesama</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Form Donasi</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {sumbangan.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tujuan Donasi *
                  </label>
                  <select
                    name="sumbangan"
                    value={formData.sumbangan}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {sumbangan.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.namaEvent} {item.targetDana ? `- Target: ${formatCurrency(item.targetDana)}` : ''}
                      </option>
                    ))}
                  </select>
                  {selectedSumbangan && selectedSumbangan.deskripsi && (
                    <p className="mt-2 text-sm text-gray-600">{selectedSumbangan.deskripsi}</p>
                  )}
                </div>
              )}

              {sumbangan.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800">Tidak ada program donasi aktif saat ini.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Donasi *
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {quickAmounts.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountClick(amount)}
                      className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                        formData.amount === amount.toString()
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 hover:bg-blue-100'
                      }`}
                    >
                      Rp {amount.toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  min="10000"
                  step="1000"
                  placeholder="Masukkan jumlah donasi (min. Rp 10.000)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pesan (Opsional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tuliskan pesan atau doa Anda..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || sumbangan.length === 0}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  isSubmitting || sumbangan.length === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {isSubmitting ? 'Memproses...' : 'Kirim Donasi'}
              </button>
            </form>

            {selectedSumbangan && selectedSumbangan.qrisImage && (
              <div className="mt-6 bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">QRIS Payment</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Scan QRIS di bawah ini untuk melakukan pembayaran langsung:
                </p>
                <div className="flex justify-center">
                  <img
                    src={getQRISImageUrl(selectedSumbangan._id)}
                    alt="QRIS"
                    onClick={() => openQRISModal(selectedSumbangan)}
                    className="cursor-pointer hover:opacity-80 transition-opacity max-w-xs"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Klik gambar untuk memperbesar
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Donasi</h2>
            
            <div className="space-y-6">
              {selectedSumbangan && (
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Program Donasi</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium">Nama Program:</span>
                      <p className="text-gray-700">{selectedSumbangan.namaEvent}</p>
                    </div>
                    {selectedSumbangan.deskripsi && (
                      <div>
                        <span className="font-medium">Deskripsi:</span>
                        <p className="text-gray-700">{selectedSumbangan.deskripsi}</p>
                      </div>
                    )}
                    {selectedSumbangan.targetDana && (
                      <div>
                        <span className="font-medium">Target Dana:</span>
                        <p className="text-gray-700">{formatCurrency(selectedSumbangan.targetDana)}</p>
                      </div>
                    )}
                    {selectedSumbangan.danaTerkumpul !== undefined && (
                      <div>
                        <span className="font-medium">Dana Terkumpul:</span>
                        <p className="text-gray-700">{formatCurrency(selectedSumbangan.danaTerkumpul || 0)}</p>
                        {selectedSumbangan.targetDana && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-blue-600 h-2.5 rounded-full"
                                style={{
                                  width: `${Math.min(
                                    ((selectedSumbangan.danaTerkumpul || 0) / selectedSumbangan.targetDana) * 100,
                                    100
                                  )}%`
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {Math.round(
                                ((selectedSumbangan.danaTerkumpul || 0) / selectedSumbangan.targetDana) * 100
                              )}% dari target
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Rekening Donasi</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Bank:</span>
                    <span>BCA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">No. Rekening:</span>
                    <span>1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Atas Nama:</span>
                    <span>Vihara Buddhayana Dharmawira Centre</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Donasi Langsung</h3>
                <p className="text-gray-700 mb-4">
                  Anda juga dapat memberikan donasi secara langsung di sekretariat vihara atau kotak donasi yang tersedia di vihara.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">📍</span>
                    <span>Sekretariat Vihara Buddhayana Dharmawira Centre</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">🕐</span>
                    <span>Senin - Minggu, 08.00 - 20.00</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Terima Kasih</h3>
                <p className="text-gray-700">
                  Setiap donasi yang Anda berikan akan digunakan untuk mendukung kegiatan vihara dan pelayanan kepada sesama. 
                  Semoga Dharma memberkati niat baik Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showQRISModal && selectedQRIS && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">QRIS Payment</h3>
              <button
                onClick={closeQRISModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="text-center">
              <img
                src={getQRISImageUrl(selectedQRIS._id)}
                alt="QRIS"
                className="mx-auto max-w-full"
                style={{ maxHeight: '400px' }}
              />
              <p className="mt-4 text-sm text-gray-600">
                Scan QRIS ini dengan aplikasi e-wallet atau mobile banking Anda
              </p>
            </div>
            <div className="mt-6">
              <button
                onClick={closeQRISModal}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Donasi;
