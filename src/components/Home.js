import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://finalbackend-ochre.vercel.app';

const Home = () => {
  const [activities, setActivities] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [infoUmum, setInfoUmum] = useState({
    jadwalPujaBakti: []
  });
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const navigate = useNavigate();

  const fetchJadwal = React.useCallback(async () => {
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const jadwalRes = await fetch(`https://finalbackend-ochre.vercel.app/api/jadwal?year=${year}&month=${month}`);
      const jadwalData = await jadwalRes.json();
      setJadwal(Array.isArray(jadwalData) ? jadwalData : []);
    } catch (error) {
      console.error('Error fetching jadwal:', error);
      setJadwal([]);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchActivities();
    fetchGalleryImages();
    fetchInfoUmum();
  }, []);

  const fetchInfoUmum = async () => {
    try {
      const response = await fetch(`${API_URL}/api/info-umum`);
      if (response.ok) {
        const data = await response.json();
        setInfoUmum({
          jadwalPujaBakti: data.jadwalPujaBakti || []
        });
      }
    } catch (error) {
      console.error('Error fetching info umum:', error);
    }
  };

  const formatDayName = (hari) => {
    const dayMap = {
      'senin': 'Senin',
      'selasa': 'Selasa',
      'rabu': 'Rabu',
      'kamis': 'Kamis',
      'jumat': 'Jumat',
      'sabtu': 'Sabtu',
      'minggu': 'Minggu'
    };
    return dayMap[hari] || hari;
  };

  const formatDayNames = (hariArray) => {
    if (!Array.isArray(hariArray)) {
      return formatDayName(hariArray);
    }
    if (hariArray.length === 0) return '';
    if (hariArray.length === 1) return formatDayName(hariArray[0]);
    if (hariArray.length === 7) return 'Setiap Hari';
    
    const sortedDays = hariArray.sort((a, b) => {
      const order = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
      return order.indexOf(a) - order.indexOf(b);
    });
    
    // Try to create ranges (e.g., "Senin - Jumat")
    if (sortedDays.length >= 2) {
      const order = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
      const firstIndex = order.indexOf(sortedDays[0]);
      const lastIndex = order.indexOf(sortedDays[sortedDays.length - 1]);
      
      if (lastIndex - firstIndex + 1 === sortedDays.length) {
        // It's a consecutive range
        return `${formatDayName(sortedDays[0])} - ${formatDayName(sortedDays[sortedDays.length - 1])}`;
      }
    }
    
    return sortedDays.map(formatDayName).join(', ');
  };

  useEffect(() => {
    fetchJadwal();
  }, [fetchJadwal]);

  const fetchActivities = async () => {
    try {
      const response = await fetch('https://finalbackend-ochre.vercel.app/api/kegiatan');
      const data = await response.json();
      
      // Handle both old format (array) and new format (object with kegiatan property)
      let activitiesData = [];
      if (Array.isArray(data)) {
        activitiesData = data;
      } else if (data.kegiatan && Array.isArray(data.kegiatan)) {
        activitiesData = data.kegiatan;
      }
      
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      
      // Filter and sort activities by nearest date
      const sortedActivities = activitiesData
        .filter(activity => {
          // Include activities that have a date (tanggalMulai or tanggalSelesai)
          const startDate = activity.tanggalMulai ? new Date(activity.tanggalMulai) : null;
          const endDate = activity.tanggalSelesai ? new Date(activity.tanggalSelesai) : null;
          
          // Use start date if available, otherwise use end date
          const activityDate = startDate || endDate;
          
          if (!activityDate) return false;
          
          // Include activities that haven't ended more than 7 days ago
          const activityDateOnly = new Date(activityDate);
          activityDateOnly.setHours(0, 0, 0, 0);
          const daysDiff = Math.floor((activityDateOnly - now) / (1000 * 60 * 60 * 24));
          
          return daysDiff >= -7;
        })
        .sort((a, b) => {
          // Get the date to compare (prefer tanggalMulai, fallback to tanggalSelesai)
          const dateA = a.tanggalMulai ? new Date(a.tanggalMulai) : (a.tanggalSelesai ? new Date(a.tanggalSelesai) : new Date(0));
          const dateB = b.tanggalMulai ? new Date(b.tanggalMulai) : (b.tanggalSelesai ? new Date(b.tanggalSelesai) : new Date(0));
          
          // Sort by date (nearest first)
          return dateA - dateB;
        });
      
      // Get the first 3 activities (nearest dates)
      setActivities(sortedActivities.slice(0, 3));
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch('https://finalbackend-ochre.vercel.app/api/galeri?limit=50');
      const data = await response.json();
      setGalleryImages(data.images || data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setLoading(false);
    }
  };

  const handleActivityClick = (activityId) => {
    // Navigate to kegiatan page with the activity ID as a parameter
    navigate(`/kegiatan?highlight=${activityId}`);
  };

  const handleViewAllActivities = () => {
    navigate('/kegiatan');
  };

  const handleViewAllGallery = () => {
    navigate('/galeri');
  };

  // Carousel auto-advance logic - cycle through all images
  useEffect(() => {
    if (galleryImages.length > 0) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % galleryImages.length
        );
      }, 10000); // 10 seconds

      return () => clearInterval(interval);
    }
  }, [galleryImages.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      (prevIndex + 1) % galleryImages.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getEventsForDate = (date) => {
    if (!date) return [];
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth();
    const dateDay = date.getDate();
    
    return jadwal.filter(event => {
      const eventDate = new Date(event.tanggal);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth();
      const eventDay = eventDate.getDate();
      
      return eventYear === dateYear && eventMonth === dateMonth && eventDay === dateDay;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const handleDateClick = (date) => {
    if (!date) return;
    const events = getEventsForDate(date);
    setSelectedDate(date);
    setSelectedDateEvents(events);
  };

  const closeDateModal = () => {
    setSelectedDate(null);
    setSelectedDateEvents([]);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return (
    <div>
      <section 
        className="relative bg-cover bg-center bg-no-repeat text-white py-20"
        style={{
          backgroundImage: `url('https://finalbackend-ochre.vercel.app/uploads/galeri/images-1760896504757-356016500.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Selamat Datang di Vihara Buddhayana Dharmawira Centre</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Bergabunglah dengan komunitas kami dalam perjalanan spiritual Buddha. 
            Mari bersama-sama melayani Dharma dan sesama dengan cinta kasih Buddha.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/tentang-kami')}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
            >
              Pelajari Lebih Lanjut
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('jadwal-puja');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Jadwal Puja
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tentang Kami</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Vihara Buddhayana Dharmawira Centre (BDC) adalah komunitas Buddha yang berdedikasi untuk melayani Dharma dan sesama. 
              Kami menyediakan berbagai kegiatan spiritual dan sosial untuk memperkuat pemahaman Buddha Dharma dan membangun persaudaraan.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-200 transition-colors">
                <span className="text-3xl">🕉️</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Puja & Meditasi</h3>
              <p className="text-gray-600 leading-relaxed">
                Puja harian dan mingguan untuk memperkuat spiritualitas, dengan berbagai waktu yang memudahkan jadwal umat Buddha.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-yellow-200 transition-colors">
                <span className="text-3xl">👥</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Komunitas</h3>
              <p className="text-gray-600 leading-relaxed">
                Membangun persaudaraan dalam Dharma melalui berbagai kegiatan dan program yang mempererat hubungan antar umat Buddha.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Pelayanan</h3>
              <p className="text-gray-600 leading-relaxed">
                Melayani sesama dengan cinta kasih Buddha melalui berbagai program sosial dan bakti sosial.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kegiatan Terbaru</h2>
            <p className="text-lg text-gray-600">Jadwal kegiatan dan acara terbaru di vihara kami</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading state
              <>
                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-200 p-3 rounded-lg mr-4 w-12 h-12"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-200 p-3 rounded-lg mr-4 w-12 h-12"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="flex items-center mb-4">
                    <div className="bg-gray-200 p-3 rounded-lg mr-4 w-12 h-12"></div>
                    <div className="flex-1">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              </>
            ) : (
              activities.map((activity) => (
                <div 
                  key={activity._id} 
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleActivityClick(activity._id)}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-orange-100 p-3 rounded-lg mr-4">
                      <span className="text-2xl">{getActivityIcon(activity.namaKegiatan)}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{activity.namaKegiatan}</h3>
                      <p className="text-gray-600">{getActivitySchedule(activity)}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{activity.deskripsi}</p>
                  <div className="flex justify-between items-center">
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
                    <span className="text-sm text-gray-500">{activity.waktu || 'TBA'}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <button 
              onClick={handleViewAllActivities}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Semua Kegiatan
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Jadwal Puja Bakti Section */}
          {infoUmum.jadwalPujaBakti && infoUmum.jadwalPujaBakti.length > 0 && (
            <div id="jadwal-puja" className="mb-16 scroll-mt-20">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Jadwal Puja Bakti</h2>
                <p className="text-lg text-gray-600">Jadwal ibadah rutin di vihara kami</p>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {infoUmum.jadwalPujaBakti.map((jadwal, index) => {
                    const dayNames = formatDayNames(jadwal.hari);
                    if (!dayNames) return null;
                    
                    return (
                      <div key={index} className="bg-blue-50 rounded-lg p-5 border border-blue-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center flex-1">
                            <span className="text-blue-600 mr-3 text-2xl">🕯️</span>
                            <div className="flex-1">
                              <h3 className="text-gray-900 font-semibold text-lg mb-1">{dayNames}</h3>
                              {jadwal.keterangan && (
                                <p className="text-gray-600 text-sm">{jadwal.keterangan}</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="ml-11">
                          <p className="text-blue-700 font-bold text-xl">{jadwal.waktu}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Kalender Kegiatan</h2>
            <p className="text-lg text-gray-600">Jadwal kegiatan dan acara di vihara kami</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => navigateMonth(-1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => navigateMonth(1)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 bg-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              {dayNames.map(day => (
                <div
                  key={day}
                  className="bg-gray-100 p-2 text-center font-semibold text-sm text-gray-700"
                >
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentDate).map((date, index) => {
                const events = getEventsForDate(date);
                const today = isToday(date);
                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={`bg-white min-h-[80px] p-2 border border-gray-200 cursor-pointer transition-all hover:bg-gray-50 ${
                      today ? 'bg-blue-50 border-blue-300 border-2' : ''
                    } ${events.length > 0 ? 'hover:shadow-md' : ''}`}
                  >
                    {date && (
                      <>
                        <div className={`font-semibold mb-1 ${today ? 'text-blue-600' : 'text-gray-900'}`}>
                          {date.getDate()}
                        </div>
                        <div className="flex flex-col gap-1">
                          {events.slice(0, 2).map((event) => (
                            <div
                              key={event._id}
                              className="text-xs px-2 py-1 rounded text-white truncate"
                              style={{
                                backgroundColor: event.kategori?.warna || '#3b82f6'
                              }}
                              title={event.judul}
                            >
                              {event.waktuMulai ? `${event.waktuMulai.substring(0, 5)} ` : ''}
                              {event.judul.length > 15 ? event.judul.substring(0, 15) + '...' : event.judul}
                            </div>
                          ))}
                          {events.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{events.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Date Details Modal */}
      {selectedDate && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center p-4"
          onClick={closeDateModal}
        >
          <div 
            className="bg-white rounded-t-2xl md:rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">
                {formatDate(selectedDate)}
              </h3>
              <button
                onClick={closeDateModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📅</div>
                  <p className="text-gray-600 text-lg">Tidak ada kegiatan pada tanggal ini</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      style={{
                        borderLeft: `4px solid ${event.kategori?.warna || '#3b82f6'}`
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-semibold text-gray-900 flex-1">
                          {event.judul}
                        </h4>
                        {event.kategori && (
                          <span
                            className="px-3 py-1 rounded-full text-xs font-medium text-white ml-2"
                            style={{
                              backgroundColor: event.kategori.warna || '#3b82f6'
                            }}
                          >
                            {event.kategori.nama || 'Umum'}
                          </span>
                        )}
                      </div>
                      
                      {event.deskripsi && (
                        <p className="text-gray-600 mb-3 text-sm">
                          {event.deskripsi}
                        </p>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        {event.waktuMulai && (
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">🕐</span>
                            <span>
                              {event.waktuMulai}
                              {event.waktuSelesai ? ` - ${event.waktuSelesai}` : ''}
                            </span>
                          </div>
                        )}
                        {event.tempat && (
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">📍</span>
                            <span>{event.tempat}</span>
                          </div>
                        )}
                        {event.kapasitas && (
                          <div className="flex items-center text-gray-600">
                            <span className="mr-2">👥</span>
                            <span>Kapasitas: {event.kapasitas} orang</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Galeri Terbaru</h2>
            <p className="text-lg text-gray-600">Momen-momen berharga dalam komunitas kami</p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : galleryImages.length > 0 ? (
            <div className="relative">
              {/* Infinite Carousel - Always show exactly 4 images */}
              <div className="relative overflow-hidden rounded-lg">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentImageIndex * 25}%)` }}
                >
                  {(() => {
                    // Create an array that always has enough images to show 4 at any position
                    const extendedImages = [];
                    const totalImages = galleryImages.length;
                    
                    // Add images multiple times to ensure we always have enough
                    for (let i = 0; i < Math.ceil(20 / totalImages); i++) {
                      galleryImages.forEach((image, index) => {
                        extendedImages.push({
                          ...image,
                          uniqueKey: `${image._id}-${i}-${index}`
                        });
                      });
                    }
                    
                    return extendedImages.map((image, index) => (
                      <div key={image.uniqueKey} className="w-1/4 flex-shrink-0 px-2">
                        <div className="relative group">
                          <img
                            src={`https://finalbackend-ochre.vercel.app${image.url}`}
                            alt={image.judul}
                            className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <h3 className="text-white font-semibold text-center px-2">{image.judul}</h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* Navigation Arrows */}
              {galleryImages.length > 4 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 z-10"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Belum ada gambar galeri yang tersedia.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button 
              onClick={handleViewAllGallery}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Lihat Galeri Lengkap
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Bergabunglah dengan Kami</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Mari bersama-sama membangun komunitas yang penuh cinta kasih dan melayani Dharma serta sesama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300">
              Daftar Kegiatan
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition duration-300">
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

const getActivityIcon = (namaKegiatan) => {
  const name = namaKegiatan.toLowerCase();
  if (name.includes('puja')) return '📅';
  if (name.includes('dharma') || name.includes('talk')) return '📚';
  if (name.includes('retret') || name.includes('meditasi')) return '🧘';
  if (name.includes('sosial') || name.includes('bakti')) return '🤝';
  if (name.includes('konser') || name.includes('budaya')) return '🎵';
  return '📅';
};

const getActivitySchedule = (activity) => {
  if (activity.waktu) {
    return activity.waktu;
  }
  if (activity.tanggalMulai && activity.tanggalSelesai) {
    const startDate = new Date(activity.tanggalMulai);
    const endDate = new Date(activity.tanggalSelesai);
    
    if (startDate.toDateString() === endDate.toDateString()) {
      return startDate.toLocaleDateString('id-ID');
    } else {
      return `${startDate.toLocaleDateString('id-ID')} - ${endDate.toLocaleDateString('id-ID')}`;
    }
  }
  return 'TBA';
};

export default Home;
