import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const Kegiatan = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    namaLengkap: '',
    email: '',
    nomorTelepon: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [searchParams] = useSearchParams();
  const [highlightedActivityId, setHighlightedActivityId] = useState(null);

  useEffect(() => {
    fetchActivities();
    
    // Check for highlighted activity from URL parameter
    const highlightId = searchParams.get('highlight');
    if (highlightId) {
      setHighlightedActivityId(highlightId);
    }
  }, [searchParams]);

  const fetchActivities = async () => {
    try {
      const response = await fetch('https://finalbackend-ochre.vercel.app/api/kegiatan');
      const data = await response.json();
      
      // Handle both old format (array) and new format (object with kegiatan property)
      if (Array.isArray(data)) {
        setActivities(data);
      } else if (data.kegiatan && Array.isArray(data.kegiatan)) {
        setActivities(data.kegiatan);
      } else {
        setActivities([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const categories = ['Semua', 'Aktif', 'Akan datang', 'Selesai'];

  const filteredActivities = selectedCategory === 'Semua' 
    ? activities 
    : activities.filter(activity => {
        switch (selectedCategory) {
          case 'Aktif':
            return activity.status === 'sedang_berlangsung' || activity.status === 'aktif';
          case 'Akan datang':
            return activity.status === 'akan_datang';
          case 'Selesai':
            return activity.status === 'selesai';
          default:
            return true;
        }
      });

  const handleRegistrationClick = (activity) => {
    setSelectedActivity(activity);
    setShowRegistrationForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check registration status when email is entered
    if (name === 'email' && value && selectedActivity) {
      checkRegistrationStatus(value);
    }
  };

  const checkRegistrationStatus = async (email) => {
    if (!selectedActivity || !email) return;
    
    setIsCheckingRegistration(true);
    try {
      const response = await fetch(`https://finalbackend-ochre.vercel.app/api/pendaftaran/check/${selectedActivity._id}/${encodeURIComponent(email)}`);
      const data = await response.json();
      setIsAlreadyRegistered(data.isRegistered);
    } catch (error) {
      console.error('Error checking registration status:', error);
      setIsAlreadyRegistered(false);
    } finally {
      setIsCheckingRegistration(false);
    }
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();
    
    if (isAlreadyRegistered) {
      alert('Anda sudah terdaftar untuk kegiatan ini sebelumnya.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const response = await fetch(`https://finalbackend-ochre.vercel.app/api/kegiatan/${selectedActivity._id}/daftar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kegiatan: selectedActivity._id,
          ...registrationData
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert('Pendaftaran berhasil! Anda akan menerima konfirmasi melalui email.');
        setShowRegistrationForm(false);
        setRegistrationData({
          namaLengkap: '',
          email: '',
          nomorTelepon: ''
        });
        setIsAlreadyRegistered(false);
      } else {
        alert(result.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeRegistrationForm = () => {
    setShowRegistrationForm(false);
    setSelectedActivity(null);
    setRegistrationData({
      namaLengkap: '',
      email: '',
      nomorTelepon: ''
    });
    setIsAlreadyRegistered(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat kegiatan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Kegiatan</h1>
          <p className="text-lg text-gray-600">Berbagai kegiatan rohani dan sosial yang dapat Anda ikuti</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredActivities.map((activity) => (
            <div 
              key={activity._id} 
              className={`rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${
                highlightedActivityId === activity._id 
                  ? 'bg-orange-50 border-2 border-orange-300 ring-2 ring-orange-200' 
                  : 'bg-white'
              }`}
              ref={(el) => {
                if (highlightedActivityId === activity._id && el) {
                  setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 100);
                }
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{activity.namaKegiatan}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  activity.status === 'akan_datang' 
                    ? 'bg-green-100 text-green-800' 
                    : (activity.status === 'sedang_berlangsung' || activity.status === 'aktif')
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status === 'akan_datang' ? 'Akan Datang' : 
                   (activity.status === 'sedang_berlangsung' || activity.status === 'aktif') ? 'Aktif' : 'Selesai'}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium mr-2">📅</span>
                  <span>{new Date(activity.tanggalMulai).toLocaleDateString('id-ID')} - {new Date(activity.tanggalSelesai).toLocaleDateString('id-ID')}</span>
                </div>
                {activity.waktu && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">🕐</span>
                    <span>{activity.waktu}</span>
                  </div>
                )}
                {activity.tempat && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">📍</span>
                    <span>{activity.tempat}</span>
                  </div>
                )}
                {activity.kapasitas && (
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium mr-2">👥</span>
                    <span>Kapasitas: {activity.kapasitas} orang</span>
                  </div>
                )}
              </div>

              <p className="text-gray-700 mb-4">{activity.deskripsi}</p>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => handleRegistrationClick(activity)}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                  disabled={activity.status === 'selesai'}
                >
                  {activity.status === 'selesai' ? 'Selesai' : 'Daftar'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada kegiatan untuk kategori ini.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600">Untuk informasi lebih lanjut tentang kegiatan, silakan hubungi sekretariat vihara.</p>
        </div>
      </div>

      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Daftar Kegiatan</h2>
                <button
                  onClick={closeRegistrationForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              {selectedActivity && (
                <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{selectedActivity.namaKegiatan}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedActivity.tanggalMulai).toLocaleDateString('id-ID')} - {new Date(selectedActivity.tanggalSelesai).toLocaleDateString('id-ID')}
                  </p>
                  {selectedActivity.tempat && (
                    <p className="text-sm text-gray-600">📍 {selectedActivity.tempat}</p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    name="namaLengkap"
                    value={registrationData.namaLengkap}
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
                    value={registrationData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      isAlreadyRegistered ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {isCheckingRegistration && (
                    <p className="text-sm text-gray-500 mt-1">Memeriksa status pendaftaran...</p>
                  )}
                  {isAlreadyRegistered && !isCheckingRegistration && (
                    <p className="text-sm text-red-600 mt-1">⚠️ Anda sudah terdaftar untuk kegiatan ini</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nomor Telepon *
                  </label>
                  <input
                    type="tel"
                    name="nomorTelepon"
                    value={registrationData.nomorTelepon}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={closeRegistrationForm}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isAlreadyRegistered}
                    className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                      isAlreadyRegistered
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50'
                    }`}
                  >
                    {isSubmitting ? 'Mendaftar...' : isAlreadyRegistered ? 'Sudah Terdaftar' : 'Daftar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kegiatan;