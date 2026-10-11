import React from 'react';
import { Code2, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} AniSphere. Academic Submission for INTECH 3112.</p>
        </div>
        
        <div className="flex items-center gap-6">
          <a
            href="https://kitsu.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
          >
            <span>Powered by Kitsu API</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="#"
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="GitHub Repository"
          >
            <Code2 className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
