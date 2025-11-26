import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const API_URL = process.env.REACT_APP_API_URL || 'https://finalbackend-ochre.vercel.app';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await fetch(`${API_URL}/api/faq/public`);
      if (response.ok) {
        const data = await response.json();
        setFaqs(Array.isArray(data) ? data : []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setLoading(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat FAQ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h1>
          <p className="text-lg text-gray-600">Temukan jawaban untuk pertanyaan umum tentang Vihara Buddhayana Dharmawira Centre</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={faq._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-inset"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.pertanyaan}
                </span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <FiChevronUp className="w-6 h-6 text-orange-600" />
                  ) : (
                    <FiChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {faq.jawaban}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {faqs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-600">Belum ada FAQ yang tersedia.</p>
          </div>
        )}

        <div className="mt-12 text-center bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Masih Ada Pertanyaan?</h2>
          <p className="text-gray-600 mb-4">
            Jika Anda memiliki pertanyaan lain yang belum terjawab, jangan ragu untuk menghubungi kami.
          </p>
          <a
            href="/tentang-kami"
            className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          >
            Hubungi Kami
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

