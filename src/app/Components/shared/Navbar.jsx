'use client'
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const Navbar = () => {
  const path = usePathname();
  const user = null; 

  const navLinks = (
    <>
      <li>
        <Link
          href="/"
          className={`font-semibold transition-colors px-3 py-2 ${
            path === "/" ? "text-[#F5726B] lg:border-b-2 lg:border-[#F5726B] lg:rounded-none" : "text-gray-700 hover:text-[#F5726B]"
          }`}
        >
          Home
        </Link>
      </li>

      <li>
        <Link
          href="/browse"
          className={`font-semibold transition-colors px-3 py-2 ${
            path === "/browse" ? "text-[#F5726B] lg:border-b-2 lg:border-[#F5726B] lg:rounded-none" : "text-gray-700 hover:text-[#F5726B]"
          }`}
        >
          Browse Recipes
        </Link>
      </li>

      {user && (
        <li>
          <Link
            href="/dashboard"
            className={`font-semibold transition-colors px-3 py-2 ${
              path.startsWith("/dashboard") ? "text-[#F5726B] lg:border-b-2 lg:border-[#F5726B] lg:rounded-none" : "text-gray-700 hover:text-[#F5726B]"
            }`}
          >
            Dashboard
          </Link>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-white border-b border-gray-100 shadow-sm px-4 lg:px-8 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown lg:hidden">
          <div tabIndex={0} role="button" className="btn btn-ghost hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-box z-50 mt-3 w-52 p-2 shadow-2xl gap-2 text-gray-700 border border-gray-100"
          >
            {navLinks}
          </ul>
        </div>

        <Link href="/" className="text-2xl font-bold tracking-tight flex items-center gap-1 cursor-pointer">
          <span>🍲</span> 
          <span className="text-[#F5726B]">
            Recipe<span className="text-gray-800">Hub</span>
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-4 text-gray-700">
          {navLinks}
        </ul>
      </div>
      
      {user ? (
        <div className="navbar-end flex items-center gap-4">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="avatar cursor-pointer">
              <div className="w-10 h-10 rounded-full ring-2 ring-[#F5726B] ring-offset-base-100 ring-offset-2 overflow-hidden">
                <Image 
                  src={user.image || "https://i.pravatar.cc/150?img=12"}
                  width={40} 
                  height={40} 
                  alt="User profile"
                  className="object-cover"
                />
              </div>
            </div>
            <ul tabIndex={0} className="dropdown-content menu menu-sm bg-white rounded-box z-50 mt-3 w-52 p-2 shadow-2xl border border-gray-100 text-gray-700">
              <li className="px-3 py-2 font-medium border-b border-gray-100 text-sm max-w-full truncate text-gray-500">
                Hi, {user.name}
              </li>
              <li><Link href="/dashboard" className="hover:text-[#F5726B] mt-1">Dashboard</Link></li>
              <li><Link href="/dashboard/profile" className="hover:text-[#F5726B]">Profile</Link></li>
              <li>
                <button className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="navbar-end flex flex-row items-center gap-2 sm:gap-4">
          <Link 
            href="/login" 
            className="py-2 px-4 text-sm font-semibold text-gray-700 hover:text-[#F5726B] transition-all duration-300"
          >
            Login
          </Link>

          <Link 
            href="/register" 
            className="py-2 px-5 rounded-full bg-[#F5726B] text-sm font-bold text-white hover:bg-[#e05f58] transition-all duration-300 shadow-sm"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;