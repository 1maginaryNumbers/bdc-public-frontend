import React, { useState, useEffect } from 'react';

const Pengumuman = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/pengumuman');
      const data = await response.json();
      
      // Handle both old format (array) and new format (object with pengumuman property)
      if (Array.isArray(data)) {
        setAnnouncements(data);
      } else if (data.pengumuman && Array.isArray(data.pengumuman)) {
        setAnnouncements(data.pengumuman);
      } else {
        setAnnouncements([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pengumuman...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pengumuman</h1>
          <p className="text-lg text-gray-600">Informasi terbaru dari Vihara Buddhayana Dharmawira Centre</p>
        </div>

        <div className="grid gap-8">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">{announcement.judul}</h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {new Date(announcement.tanggalPublikasi).toLocaleDateString('id-ID')}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{announcement.isi}</p>
              {announcement.penulis && (
                <div className="mt-4 text-sm text-gray-500">
                  <span className="font-medium">Penulis:</span> {announcement.penulis.username}
                </div>
              )}
            </div>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Belum ada pengumuman yang dipublikasikan.</p>
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-gray-600">Untuk pengumuman lebih lanjut, silakan hubungi sekretariat vihara.</p>
        </div>
      </div>
    </div>
  );
};

export default Pengumuman;
