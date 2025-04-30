'use client';

import { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import AdminSidebar from "@/components/AdminSidebar";

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    stock: "",
    category: "",
  });

  useEffect(() => {
    if (activeTab === "books") fetchBooks();
    else if (activeTab === "orders") fetchOrders();
    else if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/books");
      setBooks(res.data);
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/orders");
      // Log the response to inspect the data structure
      console.log(res.data);
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async () => {
    setCreating(true);
    try {
      const payload = {
        ...newBook,
        price: parseFloat(newBook.price),
        stock: parseInt(newBook.stock),
      };

      await axios.post("/api/admin/createBook", payload);
      toast.success("✅ Book created successfully!");
      setNewBook({
        title: "",
        author: "",
        price: "",
        description: "",
        stock: "",
        category: "",
      });
      fetchBooks();
    } catch (err) {
      console.error("Failed to create book", err);
      toast.error("❌ Failed to create book");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    try {
      await axios.delete(`/api/admin/deleteBook?id=${id}`);
      toast.success("🗑️ Book deleted!");
      fetchBooks();
    } catch (err) {
      console.error("Failed to delete book", err);
      toast.error("❌ Failed to delete book");
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(`/api/admin/updateOrderStatus?id=${orderId}&status=${status}`);
      toast.success(`✅ Order status updated to ${status}`);
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order status", err);
      toast.error("❌ Failed to update order status");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/admin/deleteUser?id=${userId}`);
      toast.success("🗑️ User deleted!");
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
      toast.error("❌ Failed to delete user");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Toaster position="top-center" />
      <AdminSidebar setActiveTab={setActiveTab} activeTab={activeTab} />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">Admin Dashboard</h1>

        {activeTab === "books" && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Create New Book</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Title" value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="border p-2 rounded" />
                <input type="text" placeholder="Author" value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  className="border p-2 rounded" />
                <input type="number" placeholder="Price" value={newBook.price}
                  onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
                  className="border p-2 rounded" />
                <input type="number" placeholder="Stock" value={newBook.stock}
                  onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                  className="border p-2 rounded" />
                <input type="text" placeholder="Category" value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  className="border p-2 rounded" />
                <textarea placeholder="Description" value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  className="border p-2 rounded col-span-2" />
              </div>
              <button
                onClick={handleCreateBook}
                disabled={creating}
                className={`mt-4 ${creating ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-2 px-4 rounded`}
              >
                {creating ? "Creating..." : "Create Book 📚"}
              </button>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
              <h2 className="text-2xl font-semibold mb-4">All Books</h2>
              {loading ? (
                <p>Loading books...</p>
              ) : books.length === 0 ? (
                <p>No books found.</p>
              ) : (
                <div className="space-y-4">
                  {books.map((book) => (
                    <div key={book.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <h3 className="text-lg font-bold">{book.title}</h3>
                        <p className="text-gray-600">{book.author}</p>
                        <p className="text-green-600 font-bold">${book.price}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                      >
                        Delete 🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-4">Orders</h2>
            {loading ? (
              <p>Loading orders...</p>
            ) : !Array.isArray(orders) || orders.length === 0 ? (
              <p>No orders found.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h3 className="text-lg font-bold">Order ID: {order.id}</h3>
                      <p className="text-gray-600">Total: ${order.total}</p>
                      <p className={`text-sm ${order.status === 'Shipped' ? 'text-green-600' : 'text-yellow-600'}`}>
                        Status: {order.status}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, order.status === 'Shipped' ? 'Pending' : 'Shipped')}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded"
                    >
                      {order.status === 'Shipped' ? 'Mark as Pending' : 'Mark as Shipped'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold mb-4">Users</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <h3 className="text-lg font-bold">{user.name}</h3>
                      <p className="text-gray-600">{user.email}</p>
                      <p className="text-gray-600">{user.role}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                    >
                      Delete 🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
