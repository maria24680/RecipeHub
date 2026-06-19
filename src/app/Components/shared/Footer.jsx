'use client'
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-1">
            <span>🍲</span>
            <span className="text-[#F5726B]">
              Recipe<span className="text-gray-800">Hub</span>
            </span>
          </Link>
          <p className="text-sm text-gray-500">
            A centralized space for recipe sharing and culinary inspiration. Create, share, and discover amazing recipes.
          </p>
        </div>

        <div>
          <h3 className="text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/" className="hover:text-[#F5726B] transition-colors">Home</Link>
            </li>
            <li>
              <Link href="/browse" className="hover:text-[#F5726B] transition-colors">Browse Recipes</Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-[#F5726B] transition-colors">Login</Link>
            </li>
            <li>
              <Link href="/register" className="hover:text-[#F5726B] transition-colors">Register</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider">Contact Information</h3>
          <ul className="space-y-2.5 text-sm text-gray-500">
            <li>Email: support@recipehub.com</li>
            <li>Phone: +1 (555) 019-2834</li>
            <li>Address: 123 Culinary Ave, Food City</li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-800 font-bold mb-4 text-sm uppercase tracking-wider">Social Links</h3>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#F5726B] hover:text-white transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"/>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#F5726B] hover:text-white transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-[#F5726B] hover:text-white transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} RecipeHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;