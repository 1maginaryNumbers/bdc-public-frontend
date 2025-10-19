import React from 'react';

const StrukturOrganisasi = () => {
  const structure = [
    {
      id: 1,
      position: "Bhikkhu Kepala",
      name: "Bhikkhu Dhammasiri",
      description: "Memimpin seluruh kegiatan spiritual dan pastoral vihara",
      image: "👨‍🦲"
    },
    {
      id: 2,
      position: "Bhikkhu Pembantu",
      name: "Bhikkhu Metta",
      description: "Membantu bhikkhu kepala dalam pelayanan spiritual",
      image: "👨‍🦲"
    },
    {
      id: 3,
      position: "Ketua Dewan Vihara",
      name: "Bapak Dharma Wijaya",
      description: "Memimpin Dewan Vihara dan koordinasi kegiatan vihara",
      image: "👨‍💼"
    },
    {
      id: 4,
      position: "Sekretaris Vihara",
      name: "Ibu Karuna Sari",
      description: "Mengelola administrasi dan dokumentasi vihara",
      image: "👩‍💼"
    },
    {
      id: 5,
      position: "Bendahara Vihara",
      name: "Bapak Dana Santoso",
      description: "Mengelola keuangan dan aset vihara",
      image: "👨‍💼"
    },
    {
      id: 6,
      position: "Koordinator Puja",
      name: "Ibu Metta Indah",
      description: "Mengkoordinasikan perayaan puja dan ritual",
      image: "👩‍💼"
    },
    {
      id: 7,
      position: "Koordinator Dharma Talk",
      name: "Bapak Sila Kurniawan",
      description: "Mengkoordinasikan program Dharma Talk dan pendidikan spiritual",
      image: "👨‍💼"
    },
    {
      id: 8,
      position: "Koordinator Karitas",
      name: "Ibu Dana Indah",
      description: "Mengkoordinasikan kegiatan sosial dan bakti sosial",
      image: "👩‍💼"
    },
    {
      id: 9,
      position: "Koordinator Pemuda",
      name: "Bapak Bodhi Pratama",
      description: "Mengkoordinasikan kegiatan kaum muda vihara",
      image: "👨‍💼"
    }
  ];

  const commissions = [
    {
      name: "Komisi Puja",
      members: ["Koordinator Puja", "Pemimpin Puja", "Pembaca Paritta", "Koor"],
      description: "Bertanggung jawab atas perayaan puja dan ritual"
    },
    {
      name: "Komisi Dharma Talk",
      members: ["Koordinator Dharma Talk", "Guru Dharma", "Asisten Dharma"],
      description: "Bertanggung jawab atas pendidikan spiritual dan Dharma Talk"
    },
    {
      name: "Komisi Karitas",
      members: ["Koordinator Karitas", "Relawan Sosial", "Tim Bakti Sosial"],
      description: "Bertanggung jawab atas kegiatan sosial dan pelayanan"
    },
    {
      name: "Komisi Pemuda",
      members: ["Koordinator Pemuda", "Sekretaris Pemuda", "Bendahara Pemuda"],
      description: "Bertanggung jawab atas kegiatan kaum muda"
    },
    {
      name: "Komisi Ekonomi",
      members: ["Bendahara", "Tim Keuangan", "Tim Aset"],
      description: "Bertanggung jawab atas pengelolaan keuangan dan aset"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Struktur Organisasi</h1>
          <p className="text-lg text-gray-600">Tim kepemimpinan dan komisi-komisi di Vihara Buddhayana Dharmawira Centre</p>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Kepemimpinan Vihara</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {structure.map((person) => (
              <div key={person.id} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="text-6xl mb-4">{person.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{person.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{person.position}</p>
                <p className="text-gray-700 text-sm">{person.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Komisi-Komisi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {commissions.map((commission, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{commission.name}</h3>
                <p className="text-gray-700 mb-4">{commission.description}</p>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Anggota:</h4>
                  <ul className="space-y-1">
                    {commission.members.map((member, memberIndex) => (
                      <li key={memberIndex} className="text-sm text-gray-600 flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        {member}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

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
