'use client';

import { useCart } from "@/pages/context/cartcontext";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/router";
import { Toaster, toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { getUserFromToken } from "@/utils/getuserFromtoken";

const Checkout = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  const [address, setAddress] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
  });

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const userInfo = getUserFromToken(); // ✅ no arguments here
    if (!userInfo) {
      router.push("/login");
    } else {
      setUser({ id: userInfo.userId, email: userInfo.email });
    }
  }, [router]);

  const handleCheckout = async () => {
    if (
      !address.name ||
      !address.email ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.postalCode
    ) {
      toast.error("Please fill out all address fields.");
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          total: totalPrice,
          orderItems: cartItems.map((item) => ({
            bookId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to place order");
      }

      toast.success("✅ Order placed successfully!");

      setTimeout(() => {
        router.push({
          pathname: "/order",
          query: {
            summary: JSON.stringify(cartItems),
            total: totalPrice.toFixed(2),
            address: JSON.stringify(address),
          },
        });
        clearCart();
        setIsPlacingOrder(false);
      }, 1000);
    } catch (error: any) {
      console.error("Order failed:", error);
      toast.error(error.message);
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-200 text-gray-800">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10 tracking-tight">
          Checkout 🧾
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-center text-lg text-gray-600">Your cart is empty.</p>
        ) : (
          <>
            {/* Address Form */}
            <div className="bg-white p-8 rounded-2xl shadow-xl mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-6">Shipping Address 📦</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {["name", "email", "phone", "street", "city", "postalCode"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                    value={address[field as keyof typeof address]}
                    onChange={(e) =>
                      setAddress({ ...address, [field]: e.target.value })
                    }
                    className={`input-style ${
                      field === "street" ? "col-span-1 md:col-span-2" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-xl shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500">By {item.author}</p>
                    <p className="text-green-600 font-bold mt-1">
                      ${item.price}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value, 10))
                      }
                      className="w-16 p-2 text-center border rounded-lg shadow-sm"
                    />
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                    >
                      Remove ❌
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Summary */}
            <div className="mt-10 text-right">
              <p className="text-2xl font-semibold mb-4">
                Total:{" "}
                <span className="text-green-700 font-bold">
                  ${totalPrice.toFixed(2)}
                </span>
              </p>
              <button
                onClick={handleCheckout}
                disabled={isPlacingOrder}
                className={`px-8 py-3 text-lg font-medium rounded-xl shadow-lg transition-all ${
                  isPlacingOrder
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isPlacingOrder ? "Placing Order..." : "Place Order 🛍️"}
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .input-style {
          @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
