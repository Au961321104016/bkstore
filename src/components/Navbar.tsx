import { FC, useState, useEffect } from 'react';
import { useCart } from '@/context/cartcontext';
import { useWishlist } from '@/context/wishlistcontext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { getUserFromToken } from '@/utils/getuserFromtoken';

interface NavbarProps {
  wishlistCount?: number; // made optional
  onOrderClick?: () => void;
}

const Navbar: FC<NavbarProps> = ({ wishlistCount = 0, onOrderClick }) => {
  const router = useRouter();
  const { cartItems, removeFromCart } = useCart();
  const { wishlist } = useWishlist();
  const [showCartDetails, setShowCartDetails] = useState(false);
  const [user, setUser] = useState<{ name?: string; email: string; role?: string } | null>(null);

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleCartClick = () => {
    setShowCartDetails((prev) => !prev);
  };

  useEffect(() => {
    const decoded = getUserFromToken();
    if (decoded) {
      setUser({ name: decoded.name, email: decoded.email, role: decoded.role });
    }
  }, []);

  return (
    <nav className="flex justify-between items-center px-15 py-3 shadow-md bg-white">
      {/* Navigation Links */}
      <ul className="flex gap-14">
        <li className="font-medium text-xl">
          <Link href="/" className="text-gray-700 hover:text-gray-900">Home</Link>
        </li>
        <li className="font-medium text-xl">
          <Link href="/about" className="text-gray-700 hover:text-gray-900">About</Link>
        </li>
        {user?.role === 'ADMIN' && (
          <li className="font-medium text-xl">
            <Link href="/admin" className="text-gray-700 hover:text-gray-900">Admin</Link>
          </li>
        )}
        <li className="font-medium text-xl">
          <Link href="/books" className="text-gray-700 hover:text-gray-900">Books</Link>
        </li>
        <li className="font-medium text-xl">
          <Link href="/order" className="text-gray-700 hover:text-gray-900">Order</Link>
        </li>
        <li className="font-medium text-xl">
          <Link href="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
        </li>
        
      </ul>

      <div className="flex items-center gap-6 relative">
        {/* Cart Button */}
        <button onClick={handleCartClick} className="relative text-2xl" title="View Cart">
          🛒
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
              {cartItemCount}
            </span>
          )}
        </button>

        {/* Wishlist Button */}
        <Link href="/wishlist" className="relative text-2xl hover:opacity-80" title="View Wishlist">
          ❤️
          {wishlistCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">
              {wishlistCount}
            </span>
          )}
        </Link>

        {/* Profile / Login */}
        {user ? (
          <div
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 cursor-pointer hover:opacity-90"
            title="Go to Profile"
          >
            <div className="rounded-full h-10 w-10 bg-gradient-to-tr from-blue-400 via-pink-500 to-yellow-400 flex items-center justify-center text-white font-bold shadow">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        ) : (
          <button
            onClick={() => router.push('/auth/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Sign In 🔑
          </button>
        )}

        {/* ✅ Order Button (Only on /order route) */}
        {router.pathname === "/order" && onOrderClick && (
          <button
            onClick={onOrderClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-all"
            title="Place Order"
          >
            ✅ Place Order
          </button>
        )}
      </div>

      {/* Cart Details Dropdown */}
      {showCartDetails && (
        <div className="absolute right-6 top-20 w-80 bg-white rounded-xl shadow-lg p-4 z-50">
          <h3 className="text-lg font-semibold mb-3">📚 Your Cart</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty 🛒</p>
          ) : (
            <ul className="space-y-3">
              {cartItems.map((book) => (
                <li key={book.id} className="flex justify-between items-center border-b pb-2">
                  <span>{book.title} (x{book.quantity})</span>
                  <button
                    onClick={() => removeFromCart(book.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ❌ Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
