import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";
import { jwtDecode } from "jwt-decode";

interface Order {
  id: string;
  total: number;
  createdAt: string;
  orderItems: {
    id: string;
    quantity: number;
    price: number;
    book: {
      title: string;
    };
  }[];
}

interface DecodedToken {
  userId: string;
  email: string;
  exp: number; // Add expiration time to token for validation
}

const OrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<DecodedToken | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // Check if the token is expired
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        console.error("Token expired");
        router.push("/login");
        return;
      }
      setUser(decoded);
    } catch (err) {
      console.error("Invalid token", err);
      router.push("/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(`/api/orders?userId=${user.userId}`);
          const data = await response.json();
          if (response.ok) {
            setOrders(data);
          } else {
            console.error("Failed to fetch orders:", data);
          }
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-t-4 border-gray-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar wishlistCount={0} />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Your Orders</h1>
        {orders.length === 0 ? (
          <p className="text-center text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-gray-700">
                  Order #{order.id} - ${order.total.toFixed(2)}
                </h2>
                <p className="text-gray-600 text-sm">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                <div className="mt-4 space-y-2">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div className="text-lg font-semibold">{item.book.title}</div>
                      <div className="text-gray-500">
                        {item.quantity} x ${item.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => router.push(`/user/orders/${order.id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
