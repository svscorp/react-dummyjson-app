import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="layout">
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/users">Users</Link></li>
                    <li><Link to="/products">Products</Link></li>
                </ul>
            </nav>
            <div className="breadcrumb">
                <Link to="/">Home</Link>
                {location.pathname !== '/' && (
                    <>
                        {' / '}
                        <span>{location.pathname.slice(1)}</span>
                    </>
                )}
            </div>
            {children}
        </div>
    );
};

export default Layout;