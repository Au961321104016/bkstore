'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

type Book = {
  id: string;
  title: string;
  author: string;
  price: number;
};

const AdminBooksPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("/api/books");
      setBooks(response.data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to delete this book?")) return;

    try {
      await axios.delete(`/api/books/${bookId}`);
      setBooks((prev) => prev.filter((book) => book.id !== bookId));
    } catch (error) {
      console.error("Failed to delete book:", error);
      alert("Failed to delete book.");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">📚 Admin - Manage Books</h1>

      {/* Create Button */}
      <div className="mb-6">
        <Link
          href="/admin/dashboard"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          ➕ Create New Book
        </Link>
      </div>

      {/* Books Table */}
      {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Author</th>
              <th className="border px-4 py-2">Price</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="text-center">
                <td className="border px-4 py-2">{book.title}</td>
                <td className="border px-4 py-2">{book.author}</td>
                <td className="border px-4 py-2">${book.price}</td>
                <td className="border px-4 py-2 space-x-2">
                  {/* Optional: Edit Button */}
                  {/* 
                  <Link 
                    href={`/admin/books/edit/${book.id}`} 
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Edit
                  </Link>
                  */}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminBooksPage;
