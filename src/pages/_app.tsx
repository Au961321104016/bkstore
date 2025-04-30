import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { CartProvider } from "@/pages/context/cartcontext";
import { WishlistProvider } from "@/context/wishlistcontext"; // ✅ Import WishlistProvider
import { ThemeProvider } from "@/context/ThemeContext";
import Footer from "@/components/footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider> {/* ✅ Wrap inside WishlistProvider */}
          <div className="flex flex-col min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
            <main className="flex-grow">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
