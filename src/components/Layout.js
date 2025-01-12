import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileHeader from './MobileHeader';
import MobileFooter from './MobileFooter';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      {!isMobile && <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen && !isMobile ? 'ml-56' : 'ml-0'} ${isMobile ? 'pt-16 pb-16' : ''}`}>
        {isMobile && !scrolled && <MobileHeader />}
        {children}
        {isMobile && scrolled && <MobileFooter />}
      </div>
      {!isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-blue-700 text-white p-2 rounded focus:outline-none"
        >
          {sidebarOpen ? '✖' : '☰'}
        </button>
      )}
    </div>
  );
};

export default Layout;