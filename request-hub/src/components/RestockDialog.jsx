import React from "react";

export default function RestockDialog({ onClose }) {
  const handleConfirm = () => {
    // Notify manager (implementation to be added later)
    alert("Restock request sent to manager!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="glass-container p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">Request Restock</h3>
        <p className="mb-4">Do you want to request a restock for this snack?</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition"
          >
            No
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}