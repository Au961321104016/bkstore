import { useCart } from "@/pages/context/cartcontext"; // Assuming the context is correctly imported
import { CartItem } from "../types";  // Correct path to types.ts

const CartPage = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();

  return (
    <div>
      <h1>Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item: CartItem) => (
            <div key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.author}</p>
              <p>${item.price}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      <button onClick={() => addToCart({
        id: "new-id",
        title: "New Book",
        author: "Some Author",
        price: 19.99,
        quantity: 0
      })}>
        Add a New Book
      </button>
    </div>
  );
};

export default CartPage;