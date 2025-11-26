import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Pengumuman from './components/Pengumuman';
import Galeri from './components/Galeri';
import Kegiatan from './components/Kegiatan';
import StrukturOrganisasi from './components/StrukturOrganisasi';
import Merchandise from './components/Merchandise';
import Donasi from './components/Donasi';
import PaketSumbangan from './components/PaketSumbangan';
import FAQ from './components/FAQ';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tentang-kami" element={<AboutUs />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/kegiatan" element={<Kegiatan />} />
          <Route path="/struktur" element={<StrukturOrganisasi />} />
          <Route path="/merchandise" element={<Merchandise />} />
          <Route path="/donasi" element={<Donasi />} />
          <Route path="/paket-sumbangan" element={<PaketSumbangan />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
