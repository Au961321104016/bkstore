// pages/address.tsx
'use client';

import { useState } from "react";
import { useRouter } from "next/router";
import { useCart } from "@/pages/context/cartcontext";
import Navbar from "@/components/Navbar";

const AddressPage = () => {
  const { cartItems, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    postalCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    // Optional: validate form
    if (!formData.name || !formData.street || !formData.city || !formData.postalCode) {
      alert("Please fill all fields.");
      return;
    }

    // Navigate to order summary page
    router.push({
      pathname: "/order",
      query: {
        summary: JSON.stringify(cartItems),
        address: JSON.stringify(formData),
      },
    });

    clearCart(); // Clear after placing order
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center">Shipping Address 🚚</h1>
        <div className="space-y-4">
          <input name="name" placeholder="Name" onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="street" placeholder="Street Address" onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="city" placeholder="City" onChange={handleChange} className="w-full border p-2 rounded" />
          <input name="postalCode" placeholder="Postal Code" onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <button
          onClick={handlePlaceOrder}
          className="mt-6 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Place Order 🛒
        </button>
      </div>
    </div>
  );
};

export default AddressPage;
