import React from 'react';
import { Layout } from './components/Layout';
import { Hero } from './components/Hero';
import { Converter } from './components/Converter';

function App() {
  return (
    <Layout>
      <Hero />
      <Converter />
    </Layout>
  );
}

export default App;