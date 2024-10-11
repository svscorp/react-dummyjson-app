import React from 'react';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Users from './pages/Users';
import Products from './pages/Products';

const App: React.FC = () => {
  return (
      <AppProvider>
        <Router>
          <div>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/users">Users</Link>
                </li>
                <li>
                  <Link to="/products">Products</Link>
                </li>
              </ul>
            </nav>

            <Routes>
              <Route path="/users" element={<Users />} />
              <Route path="/products" element={<Products />} />
              <Route path="/" element={<h1>Welcome to the Dashboard</h1>} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
  );
};

export default App;