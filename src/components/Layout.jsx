import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplet } from 'lucide-react';
import '../styles/theme.css';
import { Toaster } from './ui/toast';

const Layout = ({ children }) => {
    const location = useLocation();

    const isActive = (path) => {
        // console.log(location.pathname);
        return location.pathname === path;
    };

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    return (
        <div className="min-h-screen flex flex-col p-4">
            <header
                className={`fixed left-3 right-3 z-50 transition-colors duration-300 ${scrolled ? 'bg-black/90 shadow-md' : 'bg-transparent/40'
                    } backdrop-blur-sm rounded-full`}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <Droplet className="h-8 w-8 text-gray-400" />
                            <span className="text-3xl font-bold text-white">Dew<span className='text-gray-400 text-4xl'>D</span>rop</span>
                        </Link>
                        <nav className="flex space-x-6">
                            <Link
                                to="/"
                                className={`text-sm font-bold hover:text-black transition-colors ${isActive('/') ? 'text-white font-bold border-b-2 border-white pb-1' : 'text-gray-300'}`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/home"
                                className={`text-sm font-bold hover:text-black transition-colors ${isActive('/home') ? 'text-white border-b-2 border-white pb-1' : 'text-gray-300'}`}
                            >
                                Features
                            </Link>
                            <Link
                                to="/device/device-001"
                                className={`text-sm font-bold hover:text-black transition-colors ${location.pathname.includes('/device') ? 'text-white border-b-2 border-white pb-1' : 'text-gray-300'}`}
                            >
                                My Device
                            </Link>
                            <Link
                                to="/user-dashboard"
                                className={`text-sm font-bold hover:text-black transition-colors ${isActive('/user-dashboard') ? 'text-white border-b-2 border-white e pb-1' : 'text-gray-300'}`}
                            >
                                User Dashboard
                            </Link>
                            <Link
                                to="/admin-panel"
                                className={`text-sm font-bold hover:text-black transition-colors ${isActive('/admin-panel') ? 'text-white border-b-2 border-whitee pb-1' : 'text-gray-300'}`}
                            >
                                Admin Panel
                            </Link>
                            <Link
                                to="/profile"
                                className={`text-sm font-bold hover:text-black transition-colors ${isActive('/profile') ? 'text-white border-b-2 border-whitee pb-1' : 'text-gray-300'}`}
                            >
                                Profile
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-white/80 backdrop-blur-sm bg-footer rounded-full mt-4">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Droplet className="h-5 w-5 text-water-dark" />
                            <span className="text-sm text-gray-600">Dew<span className='text-water-dark'>D</span>rop</span>
                        </div>
                        <p className="text-sm text-gray-500">© 2025 Dew<span className='text-water-dark'>D</span>rop. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Toast notifications */}
            <Toaster />
        </div>
    );
};

export default Layout;