import React, { useState } from 'react';

const Donasi = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    purpose: '',
    message: ''
  });

  const donationPurposes = [
    { value: 'renovasi', label: 'Renovasi Vihara' },
    { value: 'kegiatan', label: 'Kegiatan Vihara' },
    { value: 'karitas', label: 'Bakti Sosial' },
    { value: 'dharma', label: 'Program Dharma Talk' },
    { value: 'umum', label: 'Keperluan Umum' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Terima kasih atas donasi Anda! Kami akan menghubungi Anda untuk konfirmasi.');
  };

  const quickAmounts = [50000, 100000, 250000, 500000, 1000000];

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
                      onClick={() => setFormData(prev => ({ ...prev, amount: amount.toString() }))}
                      className="px-3 py-2 text-sm bg-gray-100 hover:bg-blue-100 rounded-lg transition-colors"
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
                  placeholder="Masukkan jumlah donasi"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tujuan Donasi *
                </label>
                <select
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih tujuan donasi</option>
                  {donationPurposes.map((purpose) => (
                    <option key={purpose.value} value={purpose.value}>
                      {purpose.label}
                    </option>
                  ))}
                </select>
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
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Kirim Donasi
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Donasi</h2>
            
            <div className="space-y-6">
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
    </div>
  );
};

export default Donasi;
