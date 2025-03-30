import React, { useState, useEffect } from "react";

export default function InventoryItem({ item, index, handleQuantityChange, handleAddToCart, selectedCategory, cart }) {
  const [cartQuantity, setCartQuantity] = useState(0);
  const [showCartOptions, setShowCartOptions] = useState(false);

  useEffect(() => {
    if (cart && cart.length > 0) {
      const cartItem = cart.find(cartItem => cartItem.name === item.name || cartItem.itemName === item.itemName);
      if (cartItem) {
        setCartQuantity(cartItem.quantity);
      }
    }
  }, [cart, item?.name, item.itemName]);

  const handleDoubleClick = () => {
    setShowCartOptions(!showCartOptions);
  };

  const getBackgroundColorClass = (item) => {
    if (selectedCategory === "supply" && item.quantity < 10) {
      return "glass-container-red";
    } else if (selectedCategory === "snacks" && ((item.quantityInStock < item.numberOfPeopleWant * 2)) || item.quantityInStock==0) {
      return "glass-container-red";
    } else if (selectedCategory === "other" && item.quantity < 10) {
      return "glass-container-red";
    } else {
      return "glass-container";
    }
  };

  const backgroundColorClass = getBackgroundColorClass(item);

  const handleQuantityChangeForSupplyOrOther = async (index, newQuantity) => {
    const updatedItem = { ...item, quantity: newQuantity };
    // Update the quantity in the requests collection
    const itemRef = doc(db, "requests", item.id);
    try {
      await updateDoc(itemRef, { quantity: newQuantity });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <div onDoubleClick={handleDoubleClick} className={`${backgroundColorClass} p-4 rounded-lg flex flex-col items-center relative w-48 h-48`}>
      <div className="text-lg font-bold mb-2">{item.name || item.itemName}</div>
      {selectedCategory === "snacks" && (
        <div className="absolute top-2 right-2 glass-container-red text-white rounded-full w-8 h-8 flex items-center justify-center">
          {item.numberOfPeopleWant}
        </div>
      )}
      {!showCartOptions ? (
        <div className="flex flex-col items-center justify-center h-full">
          {selectedCategory === "snacks" ? (
            <div className="flex items-center mb-4">
              <button onClick={() => handleQuantityChange(index, item.quantityInStock - 1)} className="bg-gray-700 px-2 py-1 rounded-lg">-</button>
              <input
                type="number"
                value={item.quantityInStock}
                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                className="mx-2 w-16 text-center bg-gray-900 border border-gray-700 rounded-lg"
              />
              <button onClick={() => handleQuantityChange(index, item.quantityInStock + 1)} className="bg-gray-700 px-2 py-1 rounded-lg">+</button>
            </div>
          ) : selectedCategory === "supply" || selectedCategory === "other" ? (
            <div className="flex items-center mb-4">
              <button onClick={() => handleQuantityChangeForSupplyOrOther(index, item.quantity - 1)} className="bg-gray-700 px-2 py-1 rounded-lg">-</button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleQuantityChangeForSupplyOrOther(index, parseInt(e.target.value))}
                className="mx-2 w-16 text-center bg-gray-900 border border-gray-700 rounded-lg"
              />
              <button onClick={() => handleQuantityChangeForSupplyOrOther(index, item.quantity + 1)} className="bg-gray-700 px-2 py-1 rounded-lg">+</button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full">
          <input
            type="number"
            value={cartQuantity}
            onChange={(e) => setCartQuantity(parseInt(e.target.value))}
            className="mx-2 w-16 text-center bg-gray-900 border border-gray-700 rounded-lg mb-2"
          />
          <button onClick={() => handleAddToCart(item, cartQuantity)} className="glass-button bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg">
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
