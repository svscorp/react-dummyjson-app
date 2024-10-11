import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();

    return (
        <div className="layout">
            {/* Breadcrumb Navigation */}
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