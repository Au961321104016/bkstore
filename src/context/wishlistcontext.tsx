// wishlistcontext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

type WishlistContextType = {
  wishlist: string[]; // Array of book IDs
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<string[]>([]);

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
