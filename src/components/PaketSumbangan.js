import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://finalbackend-ochre.vercel.app';

const PaketSumbangan = () => {
  const [paketSumbangan, setPaketSumbangan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    namaPembeli: '',
    email: '',
    nomorTelepon: '',
    alamat: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPaketSumbangan();
    
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

  const fetchPaketSumbangan = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/paket-sumbangan?status=aktif`);
      setPaketSumbangan(response.data || []);
    } catch (error) {
      console.error('Error fetching paket sumbangan:', error);
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
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleBuyClick = (paket) => {
    setSelectedPaket(paket);
    setFormData({
      namaPembeli: '',
      email: '',
      nomorTelepon: '',
      alamat: ''
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPaket(null);
    setFormData({
      namaPembeli: '',
      email: '',
      nomorTelepon: '',
      alamat: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.namaPembeli) {
      alert('Mohon lengkapi nama pembeli.');
      return;
    }

    if (selectedPaket.stok !== null && selectedPaket.stok <= selectedPaket.terjual) {
      alert('Maaf, paket ini sudah habis.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${API_URL}/api/paket-sumbangan/payment`, {
        paketSumbangan: selectedPaket._id,
        namaPembeli: formData.namaPembeli,
        email: formData.email,
        nomorTelepon: formData.nomorTelepon,
        alamat: formData.alamat
      });

      if (response.data.token && window.snap) {
        window.snap.pay(response.data.token, {
          onSuccess: function(result) {
            alert('Pembayaran berhasil! Terima kasih atas sumbangan Anda.');
            handleCloseModal();
            fetchPaketSumbangan();
          },
          onPending: function(result) {
            alert('Pembayaran sedang diproses. Silakan selesaikan pembayaran Anda.');
            handleCloseModal();
            fetchPaketSumbangan();
          },
          onError: function(result) {
            alert('Pembayaran gagal. Silakan coba lagi.');
          },
          onClose: function() {
            alert('Anda menutup halaman pembayaran.');
          }
        });
      } else {
        alert('Error: Payment gateway tidak tersedia. Silakan coba lagi nanti.');
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      const errorMessage = error.response?.data?.message || 'Gagal membuat pembayaran. Silakan coba lagi.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:')) {
      return url;
    }
    if (url.startsWith('http')) {
      return url;
    }
    return `${API_URL}${url}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Memuat paket sumbangan...</p>
      </div>
    );
  }

  if (paketSumbangan.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Paket Sumbangan</h2>
        <p>Tidak ada paket sumbangan yang tersedia saat ini.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#2c3e50' }}>Paket Sumbangan</h1>
        <p style={{ fontSize: '1.1rem', color: '#7f8c8d' }}>
          Pilih paket sumbangan untuk acara besar dan dapatkan barang-barang spesial
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '30px',
        marginBottom: '40px'
      }}>
        {paketSumbangan.map((paket) => (
          <div 
            key={paket._id}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              backgroundColor: '#fff'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            {paket.gambar && (
              <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                <img 
                  src={getImageUrl(paket.gambar)} 
                  alt={paket.namaPaket}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover' 
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#2c3e50' }}>
                {paket.namaPaket}
              </h3>
              {paket.deskripsi && (
                <p style={{ color: '#7f8c8d', marginBottom: '15px', fontSize: '0.95rem' }}>
                  {paket.deskripsi}
                </p>
              )}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e74c3c', marginBottom: '10px' }}>
                  {formatCurrency(paket.nominal)}
                </div>
                {paket.detailBarang && paket.detailBarang.length > 0 && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e0e0e0' }}>
                    <p style={{ fontWeight: '600', marginBottom: '8px', color: '#2c3e50' }}>Isi Paket:</p>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#555' }}>
                      {paket.detailBarang.map((barang, idx) => (
                        <li key={idx} style={{ marginBottom: '5px', fontSize: '0.9rem' }}>
                          {barang.namaBarang} {barang.jumlah > 1 && `(x${barang.jumlah})`}
                          {barang.keterangan && ` - ${barang.keterangan}`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {paket.stok !== null && (
                <p style={{ fontSize: '0.85rem', color: '#7f8c8d', marginBottom: '10px' }}>
                  Stok: {paket.stok - (paket.terjual || 0)} tersedia
                </p>
              )}
              <button
                onClick={() => handleBuyClick(paket)}
                disabled={paket.stok !== null && paket.stok <= (paket.terjual || 0)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: paket.stok !== null && paket.stok <= (paket.terjual || 0) ? '#95a5a6' : '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: paket.stok !== null && paket.stok <= (paket.terjual || 0) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  if (paket.stok === null || paket.stok > (paket.terjual || 0)) {
                    e.target.style.backgroundColor = '#c0392b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (paket.stok === null || paket.stok > (paket.terjual || 0)) {
                    e.target.style.backgroundColor = '#e74c3c';
                  }
                }}
              >
                {paket.stok !== null && paket.stok <= (paket.terjual || 0) ? 'Habis' : 'Beli Paket'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedPaket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={handleCloseModal}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#7f8c8d'
              }}
            >
              ×
            </button>
            <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Beli Paket Sumbangan</h2>
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '10px', color: '#2c3e50' }}>{selectedPaket.namaPaket}</h3>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e74c3c', marginBottom: '10px' }}>
                {formatCurrency(selectedPaket.nominal)}
              </div>
              {selectedPaket.detailBarang && selectedPaket.detailBarang.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                  <p style={{ fontWeight: '600', marginBottom: '5px' }}>Isi Paket:</p>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {selectedPaket.detailBarang.map((barang, idx) => (
                      <li key={idx} style={{ marginBottom: '3px', fontSize: '0.9rem' }}>
                        {barang.namaBarang} {barang.jumlah > 1 && `(x${barang.jumlah})`}
                        {barang.keterangan && ` - ${barang.keterangan}`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                  Nama Pembeli *
                </label>
                <input
                  type="text"
                  name="namaPembeli"
                  value={formData.namaPembeli}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                  Nomor Telepon
                </label>
                <input
                  type="text"
                  name="nomorTelepon"
                  value={formData.nomorTelepon}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#2c3e50' }}>
                  Alamat
                </label>
                <textarea
                  name="alamat"
                  value={formData.alamat}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#95a5a6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: isSubmitting ? '#95a5a6' : '#e74c3c',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Memproses...' : 'Lanjutkan Pembayaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaketSumbangan;

