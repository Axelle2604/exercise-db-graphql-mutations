import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route } from 'react-router-dom';
import Users from './components/Users';
import Products from './components/Products';
import Orders from './components/Orders';
import { ApolloProvider } from 'react-apollo';
import { client } from './services/apollo.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ApolloProvider client={client}>
          <BrowserRouter>
            <Route path="/users" render={() => <Users />} />
            <Route path="/products" render={() => <Products />} />
            <Route path="/orders" render={() => <Orders />} />
          </BrowserRouter>
        </ApolloProvider>
      </div>
    );
  }
}

export default App;
