import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link"; // <-- uncommented this

const AboutPage = () => {
  return (
    <div className="bg-gray-50 text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative w-full h-72 flex items-center justify-center bg-cover bg-center text-white text-4xl font-bold shadow-lg"
        style={{ backgroundImage: "url('/images.jpg')" }}
      >
        Welcome to Our Bookstore 📖
      </div>

      {/* About Section */}
      <section className="container mx-auto px-4 py-10 text-center">
        <h2 className="text-3xl font-bold text-blue-600">Who We Are</h2>
        <p className="mt-4 text-lg text-gray-700 leading-relaxed">
          We are passionate about books! Our online bookstore offers a wide
          range of collections, from bestsellers to rare finds. Whether you're a
          casual reader or a book collector, we have something for you.
        </p>

        {/* 📚 Book Button */}
        <div className="mt-6">
          <Link href="/books">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow-md transition duration-300">
              View All Books
            </button>
          </Link>
        </div>
      </section>

      {/* 🔥 Featured Books Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold text-center text-green-600">
           Featured Books 
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
          {/* Book 1 */}
          <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <Image
              src="/book1.jpg"
              alt="Featured Book"
              width={200}
              height={300}
              className="w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-lg font-semibold">
                Limited Edition!
              </p>
            </div>
          </div>

          {/* Book 2 */}
          <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <Image
              src="/book2.jpg"
              alt="Featured Book"
              width={200}
              height={300}
              className="w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-lg font-semibold">Bestseller!</p>
            </div>
          </div>

          {/* Book 3 */}
          <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <Image
              src="/book3.jpg"
              alt="Featured Book"
              width={200}
              height={300}
              className="w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-lg font-semibold">Reader’s Choice!</p>
            </div>
          </div>

          {/* Book 4 */}
          <div className="group relative bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105">
            <Image
              src="/book4.jpg"
              alt="Featured Book"
              width={200}
              height={300}
              className="w-full h-60 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-lg font-semibold">New Arrival!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        📚 Your Favorite Online Bookstore - Since 2024
      </footer>
    </div>
  );
};

export default AboutPage;
