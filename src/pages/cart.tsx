import { useCart } from "@/context/cartcontext"; // Assuming the context is correctly imported
import { CartItem } from "../types"; // Correct path to types.ts

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-6">Your Cart</h1>
      
      {cartItems.length === 0 ? (
        <p className="text-lg text-gray-500">Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item: CartItem) => (
            <div key={item.id} className="flex items-center justify-between border-b border-gray-200 py-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-xl font-medium">{item.title}</h3>
                <p className="text-gray-600">by {item.author}</p>
              </div>
              <div className="flex items-center space-x-4">
                <p className="text-lg font-semibold">${item.price.toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => addToCart({
            id: "new-id",
            title: "New Book",
            author: "Some Author",
            price: 19.99,
            quantity: 0
          })}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
        >
          Add a New Book
        </button>
        {cartItems.length > 0 && (
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition"
            onClick={() => alert("Proceeding to Checkout")} // Replace with actual checkout logic
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default CartPage;
