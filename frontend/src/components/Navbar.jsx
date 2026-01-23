import React from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  return (
    <header className="fixed w-full top-0 z-40 bg-white/80 border-b border-cyan-100 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => handleNavigate('/')} 
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
               <div className="size-10 ">
                <img 
                  src="/logo.png" 
                  alt="Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-lg font-bold text-gray-700">Yubi</h1>
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-3">
            {authUser && (
              <>

              <button
              onClick={() => handleNavigate('/profile')}
              className="px-3 py-2 rounded-lg flex items-center gap-2 text-gray-600 hover:bg-cyan-50 transition-colors"
              >
                <User className="size-4" />
                <span className="hidden sm:inline text-sm">Profile</span>
              </button>

              <button
              onClick={logout}
              className="px-3 py-2 rounded-lg flex items-center gap-2 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </>
          )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;