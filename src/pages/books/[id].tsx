import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { useCart } from "@/pages/context/cartcontext";
import { Toaster, toast } from "react-hot-toast";
import { HeartIcon } from "@heroicons/react/24/solid"; // Filled heart icon
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline"; // Outline heart icon

const BookDetails = () => {
  const router = useRouter();
  const { id } = router.query; // This fetches the dynamic `id` from the URL
  const [book, setBook] = useState<any>(null);
  const { addToCart, cartItems } = useCart();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);

  // Fetch the book details when the component is mounted or when `id` changes
  useEffect(() => {
    if (id) {
      const fetchBook = async () => {
        try {
          const response = await axios.get(`/api/books/${id}`);
          if (response.data) {
            setBook(response.data);
          } else {
            toast.error("📚 Book not found!");
          }
        } catch (error) {
          console.error("Error fetching book details:", error);
          toast.error("❌ Failed to fetch book details!");
        }
      };
      fetchBook();
    }
  }, [id]);

  // Fetch the wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setIsLoadingWishlist(true);
        const res = await axios.get("/api/wishlist");
        setWishlist(res.data.map((item: any) => item.bookId));
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);
      } finally {
        setIsLoadingWishlist(false);
      }
    };

    fetchWishlist();
  }, []);

  const isBookInCart = cartItems.some((item) => item.id === book?.id);
  const isBookInWishlist = wishlist.includes(book?.id);

  const toggleWishlist = async () => {
    try {
      if (isBookInWishlist) {
        await axios.delete(`/api/wishlist/${book.id}`);
        setWishlist(wishlist.filter((item) => item !== book.id));
        toast.success("❌ Removed from Wishlist");
      } else {
        await axios.post("/api/wishlist", { bookId: book.id });
        setWishlist([...wishlist, book.id]);
        toast.success("❤️ Added to Wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("❌ Failed to update wishlist!");
    }
  };

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar wishlistCount={wishlist.length} />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white shadow-lg rounded-xl p-8">
          {/* Book Cover Image */}
          <div className="flex justify-center mb-6">
            <img
              src={book.imageUrl} // Assuming the book has an imageUrl field
              alt={`Cover of ${book.title}`}
              className="w-48 h-72 object-cover rounded-md"
            />
          </div>

          <h1 className="text-3xl font-bold text-gray-800">{book.title}</h1>
          <p className="text-lg text-gray-600 mt-2">by {book.author}</p>
          <p className="text-gray-700 mt-4">{book.description}</p>
          <p className="text-2xl font-bold text-green-600 mt-6">${book.price}</p>

          {/* Wishlist Button with Heart Icon */}
          <div className="mt-4">
            <button
              onClick={toggleWishlist}
              className={`${
                isBookInWishlist ? "bg-red-500" : "bg-gray-300"
              } text-white px-6 py-2 rounded-md font-semibold flex items-center gap-2 transition`}
            >
              {isBookInWishlist ? (
                <HeartIcon className="w-5 h-5" /> // Filled heart when in wishlist
              ) : (
                <HeartOutlineIcon className="w-5 h-5" /> // Outline heart when not in wishlist
              )}
              {isBookInWishlist ? "❤️ " : "❤️"}
            </button>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => {
                if (!isBookInCart) {
                  addToCart({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    quantity: 1,
                  });
                  toast.success("✅ Book added to cart!");
                } else {
                  toast("📦 This book is already in your cart.");
                }
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold transition"
            >
              Add to Cart 🛒
            </button>

            <button
              onClick={() => {
                addToCart({
                  id: book.id,
                  title: book.title,
                  author: book.author,
                  price: book.price,
                  quantity: 1,
                });
                toast.success("✅ Redirecting to checkout...");
                setTimeout(() => {
                  router.push("/checkout");
                }, 1000);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition"
            >
              Checkout ✅
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
