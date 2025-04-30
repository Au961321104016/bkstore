'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import LoadingSpinner from "@/components/Loadingspinner";


const WishlistPage = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get("/api/wishlist");
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setWishlist(data);
      } catch (err) {
        console.error("Error fetching wishlist:", err);
        setError("Failed to load wishlist.");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar wishlistCount={wishlist.length} />

      <main className="flex-grow px-4 py-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-blue-700">
          Your Wishlist ❤️
        </h1>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : wishlist.length === 0 ? (
          <p className="text-center text-gray-500">No books in your wishlist.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="border rounded-md p-3 bg-white shadow-sm hover:shadow-md transition"
              >
                <img
                  src={item.book?.image || "/placeholder.png"}
                  alt={item.book?.title || "Book image"}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h2 className="text-sm font-medium truncate">{item.book?.title}</h2>
                <p className="text-xs text-gray-500">${item.book?.price}</p>
              </div>
            ))}
          </div>
        )}
      </main>
      <LoadingSpinner/>

     
    </div>
  );
};

export default WishlistPage;