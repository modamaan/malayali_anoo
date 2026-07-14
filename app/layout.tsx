import type { Metadata } from "next";
import { Inter, Outfit, Caveat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import { CartProvider } from "@/lib/cart-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });

export const metadata: Metadata = {
  title: "Malayali Aaanoo | Premium Media & Entertainment",
  description: "Malayali Aaanoo is a premier media and entertainment company focusing on podcasts, interviews, talk shows, and community events in the UK.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${caveat.variable} h-full antialiased dark`}
    >
      <body className="flex flex-col min-h-screen bg-background text-white font-sans selection:bg-primary-500 selection:text-white">
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <main className="flex-grow flex flex-col pt-7">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
