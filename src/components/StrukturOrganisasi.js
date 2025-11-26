import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://finalbackend-ochre.vercel.app';

const StrukturOrganisasi = () => {
  const [struktur, setStruktur] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStruktur();
  }, []);

  const fetchStruktur = async () => {
    try {
      const response = await fetch(`${API_URL}/api/struktur`);
      const data = await response.json();
      
      let strukturList = [];
      if (Array.isArray(data)) {
        strukturList = data;
      } else if (data.struktur && Array.isArray(data.struktur)) {
        strukturList = data.struktur;
      }
      
      const aktifStruktur = strukturList.filter(item => item.status === 'aktif');
      setStruktur(aktifStruktur);
    } catch (error) {
      console.error('Error fetching struktur:', error);
      setStruktur([]);
    } finally {
      setLoading(false);
    }
  };

  const getAvatar = (jabatan) => {
    if (jabatan && jabatan.toLowerCase().includes('bhikkhu')) {
      return '👨‍🦲';
    }
    if (jabatan && (jabatan.toLowerCase().includes('ibu') || jabatan.toLowerCase().includes('sekretaris') || jabatan.toLowerCase().includes('koordinator'))) {
      const lowerJabatan = jabatan.toLowerCase();
      if (lowerJabatan.includes('ibu') || lowerJabatan.includes('sekretaris') || lowerJabatan.includes('karitas') || lowerJabatan.includes('puja')) {
        return '👩‍💼';
      }
    }
    return '👨‍💼';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat struktur organisasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Struktur Organisasi</h1>
          <p className="text-lg text-gray-600">Tim kepemimpinan dan komisi-komisi di Vihara Buddhayana Dharmawira Centre</p>
        </div>

        {struktur.length > 0 ? (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Kepemimpinan Vihara</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {struktur.map((person) => (
                <div key={person._id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-6xl mb-4">{getAvatar(person.jabatan)}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{person.nama}</h3>
                  <p className="text-blue-600 font-medium mb-2">{person.jabatan}</p>
                  {person.periode && (
                    <p className="text-gray-500 text-sm mb-2">Periode: {person.periode}</p>
                  )}
                  {person.kontak && (
                    <p className="text-gray-600 text-sm">{person.kontak}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Struktur organisasi sedang disiapkan.</p>
          </div>
        )}

        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ingin Bergabung?</h3>
          <p className="text-gray-700 mb-6">
            Kami selalu membuka kesempatan bagi umat yang ingin terlibat dalam pelayanan vihara. 
            Hubungi sekretariat vihara untuk informasi lebih lanjut.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Hubungi Kami
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrukturOrganisasi;
