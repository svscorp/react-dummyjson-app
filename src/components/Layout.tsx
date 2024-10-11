import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
                        <span>{capitalize(location.pathname.slice(1))}</span>
                    </>
                )}
            </div>
            {children}
        </div>
    );
};

export default Layout;