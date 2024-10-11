import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import Users from './pages/Users';
import Products from './pages/Products';

const Home: React.FC = () => (
    <div className="home-page">
        <h1>Welcome to the Dashboard</h1>
        <div className="home-buttons">
            <Link to="/users" className="home-button">
                Users
            </Link>
            <Link to="/products" className="home-button">
                Products
            </Link>
        </div>
    </div>
);

const App: React.FC = () => {
    return (
        <Router>
            <AppProvider>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/products" element={<Products />} />
                    </Routes>
                </Layout>
            </AppProvider>
        </Router>
    );
};

export default App;