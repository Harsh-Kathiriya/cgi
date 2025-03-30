import React, { useState } from "react";

export default function CartItem({ item, handleDeleteFromCart }) {
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const handleDoubleClick = () => {
    setShowDeleteButton(!showDeleteButton);
  };

  return (
    <div onDoubleClick={handleDoubleClick} className="cart-item p-4 rounded-lg flex flex-col items-center relative w-48 h-48">
      <div className="text-lg font-bold mb-2">{item.name}</div>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-xl">{item.quantity}</div>
        {showDeleteButton && (
          <button onClick={() => handleDeleteFromCart(item.id)} className="glass-button bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg mt-2">
            Delete
          </button>
        )}
      </div>
    </div>
  );
}