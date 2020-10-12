import { ApolloProvider } from '@apollo/client';
import React from 'react';
import { client } from 'utils/client';
import { Detail, Overview } from './pages';
import { Header } from './components/Header';

import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Header />
        <Detail />
      </div>
    </ApolloProvider>
  );
}

export default App;
