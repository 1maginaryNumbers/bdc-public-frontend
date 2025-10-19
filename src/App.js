import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Pengumuman from './components/Pengumuman';
import Galeri from './components/Galeri';
import Kegiatan from './components/Kegiatan';
import StrukturOrganisasi from './components/StrukturOrganisasi';
import Merchandise from './components/Merchandise';
import Donasi from './components/Donasi';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pengumuman" element={<Pengumuman />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/kegiatan" element={<Kegiatan />} />
          <Route path="/struktur" element={<StrukturOrganisasi />} />
          <Route path="/merchandise" element={<Merchandise />} />
          <Route path="/donasi" element={<Donasi />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
