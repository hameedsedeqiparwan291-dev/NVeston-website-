import React from 'react';
import Layout from './components/site/Layout.jsx';

export default function App({ route, Page }) {
  return (
    <Layout route={route}>
      <Page route={route} />
    </Layout>
  );
}
