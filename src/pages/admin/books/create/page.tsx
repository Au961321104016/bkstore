'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const CreateBookPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    stock: "",
    category: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/admin/createBook", form);
      alert("✅ Book created successfully!");
      router.push("/admin/books"); // after create, go back to dashboard
    } catch (error) {
      console.error("Failed to create book:", error);
      alert("❌ Failed to create book");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">➕ Create New Book</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <input
          name="title"
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="author"
          type="text"
          placeholder="Author"
          value={form.author}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="category"
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Create Book 📚
        </button>
      </form>
    </div>
  );
};

export default CreateBookPage;
