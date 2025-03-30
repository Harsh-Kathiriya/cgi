import React from "react";

export default function SelectionBar({ selectedCategory, setSelectedCategory }) {
  return (
    <div className="flex gap-4 mb-4">
      <button
        onClick={() => setSelectedCategory("snacks")}
        className={`px-4 py-2 rounded-lg ${selectedCategory === "snacks" ? "bg-blue-700 scale-110" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        Snacks
      </button>
      <button
        onClick={() => setSelectedCategory("supply")}
        className={`px-4 py-2 rounded-lg ${selectedCategory === "supply" ? "bg-blue-700 scale-110" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        Office Supplies
      </button>
      <button
        onClick={() => setSelectedCategory("other")}
        className={`px-4 py-2 rounded-lg ${selectedCategory === "other" ? "bg-blue-700 scale-110" : "bg-blue-500 hover:bg-blue-600"}`}
      >
        Others
      </button>
    </div>
  );
}