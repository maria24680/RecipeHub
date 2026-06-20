'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  useEffect(() => {
    const savedTheme = localStorage.getItem('recipehub-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleThemeToggle = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('recipehub-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('recipehub-theme', 'light');
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Browse Recipes', path: '/browse' },
  ];

  return (
    <nav className="bg-white dark:bg-zinc-950 border-b border-[#DFD0BD]/60 dark:border-zinc-800 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="font-extrabold text-2xl tracking-wide text-black dark:text-white transition-colors">
              Recipe<span className="text-[#F5726B]">Hub</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#F5726B] border-b-2 border-[#F5726B]'
                    : 'text-gray-700 dark:text-gray-200 hover:text-[#AE514B]'
                } pb-1`}
              >
                {link.name}
              </Link>
            ))}

            {user && (
              <Link
                href="/dashboard"
                className={`font-medium transition-colors ${
                  isActive('/dashboard')
                    ? 'text-[#F5726B] border-b-2 border-[#F5726B]'
                    : 'text-gray-700 dark:text-gray-200 hover:text-[#AE514B]'
                } pb-1`}
              >
                Dashboard
              </Link>
            )}
          </div>

          <div className="hidden md:flex space-x-4 items-center">
            <button
              onClick={handleThemeToggle}
              className="p-2 rounded-full border border-[#DFD0BD] hover:bg-[#DFD0BD]/20 transition-colors text-gray-700 dark:text-gray-200"
              title="Toggle Theme"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src={user?.image || 'https://via.placeholder.com/150'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-[#AE514B] object-cover"
                  />
                  {user?.isPremium && (
                    <span className="bg-[#F5726B] text-white text-[10px] uppercase font-bold px-1.5 py-0.5 rounded">
                      PRO
                    </span>
                  )}
                </div>
                <button
                  onClick={onLogout}
                  className="bg-[#AE514B] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-opacity-90 transition shadow-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-[#AE514B] font-medium text-sm transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-[#F5726B] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-opacity-90 transition shadow-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={handleThemeToggle}
              className="p-1.5 rounded-full border border-[#DFD0BD] text-sm text-gray-700 dark:text-gray-200"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-[#AE514B] focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-950 border-b border-[#DFD0BD]">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium ${
                  isActive(link.path)
                    ? 'bg-[#DFD0BD]/30 text-[#F5726B]'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {user && (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md font-medium ${
                  isActive('/dashboard')
                    ? 'bg-[#DFD0BD]/30 text-[#F5726B]'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-900'
                }`}
              >
                Dashboard
              </Link>
            )}

            <div className="border-t border-[#DFD0BD] pt-4 pb-2 px-3">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={user?.image || 'https://via.placeholder.com/150'}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border border-[#AE514B]"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{user?.name}</p>
                      {user?.isPremium && (
                        <span className="bg-[#F5726B] text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded">
                          Premium User
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => { onLogout(); setIsOpen(false); }}
                    className="bg-[#AE514B] text-white px-3 py-1.5 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="text-center w-full block border border-[#AE514B] text-[#AE514B] px-4 py-2 rounded-md font-medium text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsOpen(false)}
                    className="text-center w-full block bg-[#F5726B] text-white px-4 py-2 rounded-md font-medium text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}