import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

const useFullCartItems = () => {
  const { cartItems, getCartItems } = useCart();
  const [fullCartItems, setFullCartItems] = useState([]);

  useEffect(() => {
    async function loadItems() {
      try {
        const items = await getCartItems();

        const withImages = await Promise.all(
          items.map(async (item) => {
            if (item.image) {
              try {
                const imported = await import(`../images/${item.image}`);
                return { ...item, image: imported.default };
              } catch (err) {
                console.error("Image load error:", err);
              }
            }
            return item;
          })
        );

        setFullCartItems(withImages);
      } catch (err) {
        console.error("Failed to load full cart items:", err);
        setFullCartItems(cartItems);
      }
    }

    loadItems();
  }, [cartItems, getCartItems]);

  return fullCartItems;
};

export default useFullCartItems;
