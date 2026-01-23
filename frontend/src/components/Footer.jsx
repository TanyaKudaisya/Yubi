import React from 'react';
import { Coffee, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-cyan-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center gap-2 text-gray-600">
            <span>Made with</span>
            <Coffee className="size-4 text-cyan-500" />
            <span>by</span>
            <span className="font-semibold text-cyan-500">Tanya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;