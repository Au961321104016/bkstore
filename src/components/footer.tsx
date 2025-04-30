import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side - Branding */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-yellow-400">📚 Book Haven</h2>
          <p className="mt-2 text-gray-400">Your one-stop shop for amazing books.</p>
        </div>

        {/* Center - Navigation Links */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-yellow-400">Quick Links</h3>
          <ul className="mt-2 space-y-2">
            <li><Link href="/" className="hover:text-yellow-300">Home</Link></li>
            <li><Link href="/books" className="hover:text-yellow-300">Books</Link></li>
            <li><Link href="/checkout" className="hover:text-yellow-300">Checkout</Link></li>
            <li><Link href="/contact" className="hover:text-yellow-300">Contact</Link></li>
          </ul>
        </div>

        {/* Right Side - Social Media */}
        <div className="text-center md:text-right">
          <h3 className="text-xl font-semibold text-yellow-400">Follow Us</h3>
          <div className="mt-2 flex justify-center md:justify-end space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">📘 Facebook</a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">🐦 Twitter</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">📸 Instagram</a>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="mt-6 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Book Haven. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
