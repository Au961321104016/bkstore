import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

interface CartItem {
  id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

interface Address {
  name: string;
  street: string;
  city: string;
  postalCode: string;
}

interface DecodedToken {
  userId: string;
  email: string;
}

const OrderPage = () => {
  const router = useRouter();
  const [orderItems, setOrderItems] = useState<CartItem[]>([]);
  const [address, setAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const continueBtnRef = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useState<DecodedToken | null>(null);

  const totalAmount = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = orderItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token", err);
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (router.query.summary && router.query.address) {
      try {
        const items: CartItem[] = JSON.parse(router.query.summary as string);
        const addr: Address = JSON.parse(router.query.address as string);
        setOrderItems(items);
        setAddress(addr);
      } catch (error) {
        console.error("Failed to parse order data:", error);
        router.push("/orders");
      } finally {
        setLoading(false);
      }
    } else {
      router.push("/orders");
    }
  }, [router.query]);

  const handlePlaceOrder = async () => {
    if (orderItems.length > 0 && address && user) {
      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            userId: user.userId,
            orderItems: orderItems.map((item) => ({
              bookId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          }),
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          console.error("❌ Response from /api/orders is not JSON:", text);
          return;
        }

        if (!response.ok || !data.success) {
          console.error("❌ Order creation failed:", data);
          setOrderCreated(false);
        } else {
          console.log("✅ Order created:", data);
          setOrderCreated(true);
          await sendConfirmationEmail();
        }
      } catch (error) {
        console.error("Error creating order:", error);
        setOrderCreated(false);
      }
    }
  };

  const sendConfirmationEmail = async () => {
    if (!user) return;

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: user.email,
          subject: "Order Confirmation",
          message: `Thanks for your order of $${totalAmount.toFixed(
            2
          )}! We’ll ship it soon.`,
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("❌ Response from /api/send-email is not JSON:", text);
        return;
      }

      if (!response.ok) {
        console.error("❌ Email send failed:", data);
      } else {
        console.log("📧 Email sent:", data);
        setEmailSent(true);
      }
    } catch (error) {
      console.error("Email error:", error);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-gray-500 text-lg">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar wishlistCount={0} onOrderClick={handlePlaceOrder} />
      <div className="container mx-auto px-4 py-10">
        {orderCreated && emailSent && (
          <h1 className="text-3xl font-bold text-green-700 text-center mb-6">
            ✅ Order Placed Successfully!
          </h1>
        )}

        {!orderCreated && (
          <p className="text-red-500 text-center mb-4">
            ⚠️ Failed to save your order. Please try again later.
          </p>
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Order Summary 🧾
          </h2>

          {orderItems.map((item) => (
            <div
              key={item.id}
              className="border-b py-4 flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm">By {item.author}</p>
                <p className="text-sm">Quantity: {item.quantity}</p>
              </div>
              <p className="font-semibold text-green-700">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="mt-6 text-right text-xl font-bold">
            Total ({totalItems} {totalItems > 1 ? "items" : "item"}):{" "}
            <span className="text-green-800">${totalAmount.toFixed(2)}</span>
          </div>

          {address && (
            <div className="mt-8 bg-gray-100 p-4 rounded-lg border text-gray-700">
              <h3 className="text-lg font-semibold mb-2">📦 Shipping Address</h3>
              <p><strong>Name:</strong> {address.name}</p>
              <p><strong>Street:</strong> {address.street}</p>
              <p><strong>City:</strong> {address.city}</p>
              <p><strong>Postal Code:</strong> {address.postalCode}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/books">
              <button
                ref={continueBtnRef}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow transition-all"
              >
                📚 Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
