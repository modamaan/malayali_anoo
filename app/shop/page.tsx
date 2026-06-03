import { MOCK_MERCH } from "@/lib/data";
import Link from "next/link";

export default function ShopPage() {
  return (
    <div className="flex flex-col min-h-screen pt-12 pb-24">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tighter mb-6">
          <span className="text-white">OUR </span>
          <span className="text-primary-500">SHOP</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light">
          Official Malayali AAANOO merchandise. Wear the culture.
        </p>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_MERCH.map((product) => (
            <div key={product.id} className="group bg-card border border-card-border rounded-2xl overflow-hidden hover:border-primary-500/50 transition-colors flex flex-col">
              <div className="aspect-[4/5] relative overflow-hidden bg-black/50 p-8 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl shadow-lg hover:bg-primary-500 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2 gap-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-primary-500 transition-colors">{product.name}</h3>
                  <span className="text-lg font-black text-white bg-white/10 px-3 py-1 rounded-lg">₹{product.price}</span>
                </div>
                <p className="text-gray-400 text-sm mt-2 line-clamp-2">{product.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
