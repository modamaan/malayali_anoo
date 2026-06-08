"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TiltLogo from "./TiltLogo";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // 1. Check if this device has been used by an admin before
    if (typeof window !== 'undefined') {
      const knownDevice = localStorage.getItem('knownAdminDevice');
      if (knownDevice === 'true') {
        setShowAdminLink(true);
      }
    }

    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('email', session.user.email)
          .limit(1);

        if (data && data.length > 0 && data[0].role === 'admin') {
          setShowAdminLink(true);
          localStorage.setItem('knownAdminDevice', 'true'); // Remember this device forever
        } else {
          setShowAdminLink(false);
          localStorage.removeItem('knownAdminDevice');
        }
      }
    };
    checkUser();

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user?.email) {
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('email', session.user.email)
          .limit(1);

        if (data && data.length > 0 && data[0].role === 'admin') {
          setShowAdminLink(true);
          localStorage.setItem('knownAdminDevice', 'true');
        }
      }
      // Notice: We deliberately DO NOT set showAdminLink to false when they log out.
      // Because we want the button to stay visible for this specific computer.
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Events", href: "/events" },
    { name: "Shop", href: "/shop" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Contact", href: "/contact" },
  ];

  const links = showAdminLink ? [...baseLinks, { name: "Admin", href: "/admin/portfolio" }] : baseLinks;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center -ml-2">
            <Link href="/" className="flex items-center" aria-label="Home">
              <TiltLogo />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {links.map((link) => {
                const isActive = pathname === link.href;
                const isAdminLink = link.name === "Admin";
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-2 py-2 text-sm font-medium uppercase tracking-widest transition-colors group ${
                        isActive ? "text-white" : isAdminLink ? "text-primary-500 font-bold hover:text-primary-400" : "text-gray-300 hover:text-white"
                      }`}
                  >
                    {link.name}
                    <span className={`absolute left-0 -bottom-1 h-1 transition-all duration-300 ${
                        isAdminLink ? "bg-primary-500" : "bg-primary-500"
                    } ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}></span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t border-white/10 absolute top-20 left-0 w-full bg-black/95 shadow-xl animate-fade-in-up">
          <div className="px-4 py-4 space-y-2 flex flex-col">
            {links.map((link) => {
              const isActive = pathname === link.href;
              const isAdminLink = link.name === "Admin";
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-base font-medium uppercase tracking-widest text-center transition-colors group ${
                    isActive ? "text-white" : isAdminLink ? "text-primary-500 font-bold hover:text-primary-400" : "text-gray-300 hover:text-white"
                    }`}
                >
                  <span className="relative inline-block pb-1">
                    {link.name}
                    <span className={`absolute left-0 bottom-0 h-1 bg-primary-500 transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}></span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
