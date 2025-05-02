'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useCart } from "@/context/cartcontext";
import { useWishlist } from "@/context/wishlistcontext";
import Navbar from "@/components/Navbar";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";  // Outline Heart
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";  // Solid Heart
import LoadingSpinner from "@/components/LoadingSpinner";

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
};

const BookPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { wishlist, setWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/books");
        const booksWithImages = response.data.map((book: Book) => ({
          ...book,
          imageUrl: book.imageUrl || "https://via.placeholder.com/150",
        }));
        setBooks(booksWithImages);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchWishlist = async () => {
      try {
        const res = await axios.get("/api/wishlist");
        setWishlist(res.data.map((item: { bookId: string }) => item.bookId));
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      }
    };

    fetchBooks();
    fetchWishlist();
  }, [setWishlist]);

  const toggleWishlist = async (bookId: string) => {
    try {
      if (wishlist.includes(bookId)) {
        await axios.delete(`/api/wishlist/${bookId}`);
        setWishlist((prev) => prev.filter((id) => id !== bookId));
      } else {
        await axios.post("/api/wishlist", { bookId });
        setWishlist((prev) => [...prev, bookId]);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar wishlistCount={wishlist.length} />

      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
          📚 Available Books
        </h1>

        <div className="max-w-md mx-auto mb-8">
          <input
            type="text"
            placeholder="Search books by title..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredBooks.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="relative bg-white shadow-lg rounded-lg p-6 pt-12 transition-transform transform hover:scale-105 hover:shadow-xl"
              >
                <button
                  onClick={() => toggleWishlist(book.id)}
                  className="absolute top-4 right-4 text-2xl hover:scale-110 transition-transform"
                  title={wishlist.includes(book.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {wishlist.includes(book.id) ? (
                    <HeartSolid className="h-6 w-6 text-red-500" />
                  ) : (
                    <HeartOutline className="h-6 w-6 text-gray-400" />
                  )}
                </button>

                <img
                  src={book.imageUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />

                <h3 className="text-2xl font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600 text-sm">By {book.author}</p>
                <p className="text-lg font-bold text-green-600 mt-2">${book.price}</p>

                <Link
                  href={`/books/${book.id}`}
                  className="block mt-4 text-center text-white bg-blue-600 hover:bg-blue-700 py-2 rounded-lg shadow-md transition"
                >
                  View Details
                </Link>

                <button
                  onClick={() =>
                    addToCart({
                      id: book.id,
                      title: book.title,
                      author: book.author,
                      price: book.price,
                      quantity: 1,
                    })
                  }
                  className="w-full mt-4 text-lg font-semibold bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:ring-2 focus:ring-orange-400"
                >
                  Add to Cart 🛒
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;
