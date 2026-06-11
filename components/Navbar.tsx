"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TiltLogo from "./TiltLogo";
import { createClient } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const pathname = usePathname();
  const supabase = createClient();
  const { cartCount, openCart } = useCart();

  useEffect(() => {
    const fetchRole = async (userId: string) => {
      const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
      setUserRole(data?.role || 'user');
    };

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) fetchRole(session.user.id);
      else setUserRole(null);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchRole(session.user.id);
      else setUserRole(null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserRole(null);
  };

  const baseLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Events", href: "/events" },
    { name: "Shop", href: "/shop" },
    { name: "Sponsors", href: "/sponsors" },
    { name: "Contact", href: "/contact" },
  ];

  let extraLink = null;
  if (userRole === 'admin') extraLink = { name: "Admin", href: "/admin/portfolio", isPrimaryButton: true };
  else if (userRole === 'user') extraLink = { name: "Logout", href: "#", isButton: true, isPrimaryButton: true };

  const links = extraLink ? [...baseLinks, extraLink] : baseLinks;

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
                const isPrimary = (link as any).isPrimaryButton;

                if ((link as any).isButton) {
                  return (
                    <button
                      key={link.name}
                      onClick={handleLogout}
                      className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-5 py-2 rounded-lg transition-colors text-sm uppercase tracking-widest whitespace-nowrap"
                    >
                      {link.name}
                    </button>
                  );
                }

                if (isPrimary) {
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-5 py-2 rounded-lg transition-colors text-sm uppercase tracking-widest whitespace-nowrap"
                    >
                      {link.name}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-2 py-2 text-sm font-medium uppercase tracking-widest transition-colors group whitespace-nowrap ${
                        isActive ? "text-white" : "text-gray-300 hover:text-white"
                      }`}
                  >
                    {link.name}
                    <span className={`absolute left-0 -bottom-1 h-1 transition-all duration-300 bg-primary-500 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}></span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Cart + Mobile Menu Buttons */}
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <button
              onClick={openCart}
              aria-label="Open cart"
              className="relative p-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
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
