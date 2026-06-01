import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo_white-1.png"
                alt="Malayali Aano Logo"
                width={280}
                height={80}
                className="w-56 md:w-64 h-auto object-contain hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className="text-gray-400 max-w-sm">
              We are a premium media and entertainment team based in Kerala, bringing you the best in dynamic storytelling and digital experiences.
            </p>
          </div>

          <div>
            <h3 className="text-white font-heading font-bold uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-primary-500 transition-colors">About Us</Link></li>
              <li><Link href="/portfolio" className="text-gray-400 hover:text-primary-500 transition-colors">Portfolio</Link></li>
              <li><Link href="/events" className="text-gray-400 hover:text-primary-500 transition-colors">Events</Link></li>
              <li><Link href="/shop" className="text-gray-400 hover:text-primary-500 transition-colors">Shop</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-heading font-bold uppercase tracking-widest mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
                IG
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary-600 transition-colors">
                YT
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Malayali Aano. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0 text-sm">
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
