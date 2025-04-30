import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Navbar from "@/components/Navbar";

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  book: {
    title: string;
  };
}

interface Order {
  id: string;
  total: number;
  createdAt: string;
  orderItems: OrderItem[];
}

const OrderDetailPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`/api/orders/${orderId}`);
          const data = await response.json();
          if (response.ok) {
            setOrder(data);
          } else {
            console.error("Failed to fetch order details:", data);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [orderId]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading order details...</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex justify-center items-center">Order not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <Navbar wishlistCount={0} />
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Order Details</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700">
            Order #{order.id} - ${order.total.toFixed(2)}
          </h2>
          <p className="text-gray-600">Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
          <div className="mt-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="border-b py-2">
                <h3 className="font-semibold text-lg">{item.book.title}</h3>
                <p className="text-gray-600">
                  {item.quantity} x ${item.price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <button
              onClick={() => router.push("/user/orders")}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
