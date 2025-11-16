import React, { useState, useEffect, useCallback } from 'react';

const Galeri = () => {
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalImages: 0,
    imagesPerPage: 20,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('https://finalbackend-ochre.vercel.app/api/kategori-galeri');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }, []);

  const fetchGalleryImages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://finalbackend-ochre.vercel.app/api/galeri?page=${currentPage}&limit=20`);
      const data = await response.json();
      setGalleryImages(data.images);
      setPagination(data.pagination);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchGalleryImages();
  }, [fetchGalleryImages]);

  const filteredImages = selectedCategory === 'Semua' 
    ? galleryImages 
    : galleryImages.filter(img => {
        const imgKategori = img.kategori?.toLowerCase() || '';
        return imgKategori === selectedCategory.toLowerCase();
      });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-lg transition-colors ${
            i === pagination.currentPage
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          onClick={() => handlePageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className={`px-4 py-2 rounded-lg transition-colors ${
            pagination.hasPrevPage
              ? 'bg-white text-gray-700 hover:bg-gray-100'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Previous
        </button>
        
        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 mx-1 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition-colors"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2 text-gray-500">...</span>}
          </>
        )}
        
        {pages}
        
        {endPage < pagination.totalPages && (
          <>
            {endPage < pagination.totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
            <button
              onClick={() => handlePageChange(pagination.totalPages)}
              className="px-3 py-2 mx-1 rounded-lg bg-white text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {pagination.totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => handlePageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className={`px-4 py-2 rounded-lg transition-colors ${
            pagination.hasNextPage
              ? 'bg-white text-gray-700 hover:bg-gray-100'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat galeri...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Galeri</h1>
          <p className="text-lg text-gray-600">Momen-momen berharga dalam komunitas kami</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => handleCategoryChange('Semua')}
            className={`px-6 py-2 rounded-full transition-colors ${
              selectedCategory === 'Semua'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Semua
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategoryChange(category.nama)}
              className={`px-6 py-2 rounded-full transition-colors text-white ${
                selectedCategory === category.nama
                  ? 'opacity-100 shadow-lg'
                  : 'opacity-90 hover:opacity-100'
              }`}
              style={{
                backgroundColor: selectedCategory === category.nama 
                  ? category.warna || '#3b82f6' 
                  : category.warna || '#3b82f6'
              }}
            >
              {category.nama}
            </button>
          ))}
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">
            Menampilkan {filteredImages.length} dari {pagination.totalImages} gambar 
            (Halaman {pagination.currentPage} dari {pagination.totalPages})
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <div key={image._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-12">
                <img
                  src={`https://finalbackend-ochre.vercel.app${image.url}`}
                  alt={image.judul}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{image.judul}</h3>
                {image.deskripsi && (
                  <p className="text-sm text-gray-600 mb-2">{image.deskripsi}</p>
                )}
                {(() => {
                  const categoryObj = categories.find(cat => 
                    cat.nama.toLowerCase() === (image.kategori || '').toLowerCase()
                  );
                  return (
                    <span 
                      className="text-sm text-white px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: categoryObj?.warna || '#3b82f6'
                      }}
                    >
                      {image.kategori || 'Umum'}
                    </span>
                  );
                })()}
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Tidak ada gambar untuk kategori ini.</p>
          </div>
        )}

        {renderPagination()}

        <div className="mt-12 text-center">
          <p className="text-gray-600">Galeri ini akan terus diperbarui dengan foto-foto terbaru dari kegiatan vihara.</p>
        </div>
      </div>
    </div>
  );
};

export default Galeri;
