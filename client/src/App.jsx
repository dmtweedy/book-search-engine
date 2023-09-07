import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client'; // Import ApolloProvider
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

import Navbar from './components/Navbar';

// Create instance
const httpLink = createHttpLink({
  uri: '/graphql', // GraphQL server endpoint
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;