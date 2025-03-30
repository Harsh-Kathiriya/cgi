import { useState } from "react";
import { db, collection, addDoc } from "../firebase/firebase";

export default function AddSnackDialog({ onClose, snacks }) {
  const [newSnackName, setNewSnackName] = useState("");
  const [matchingSnacks, setMatchingSnacks] = useState([]);

  const handleSnackNameChange = (e) => {
    const value = e.target.value;
    setNewSnackName(value);

    if (value.trim() === "") {
      setMatchingSnacks([]);
      return;
    }

    const matches = snacks.filter((snack) =>
      snack.name.toLowerCase().includes(value.toLowerCase())
    );
    setMatchingSnacks(matches);
  };

  const handleAddSnack = async () => {
    if (newSnackName.trim() === "") return;

    const existingSnack = snacks.find(
      (snack) => snack.name.toLowerCase() === newSnackName.toLowerCase()
    );
    if (existingSnack) {
      alert("Snack already exists!");
      return;
    }

    const newSnack = {
      name: newSnackName,
      numberOfPeopleWant: 0,
      quantityInStock: 0,
    };

    try {
      await addDoc(collection(db, "snacks"), newSnack);
      setNewSnackName("");
      onClose();
    } catch (error) {
      console.error("Error adding snack: ", error);
      alert("Failed to add snack.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-bold mb-4">Add a New Snack</h3>
        <input
          type="text"
          placeholder="Enter snack name..."
          value={newSnackName}
          onChange={handleSnackNameChange}
          className="p-4 bg-gray-700 text-white rounded-md w-full text-lg mb-4"
        />
        {matchingSnacks.length > 0 && (
          <ul className="bg-gray-700 p-2 rounded-md mb-4">
            {matchingSnacks.map((snack) => (
              <li key={snack.id} className="p-2">
                {snack.name}
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded-lg hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAddSnack}
            className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition"
          >
            Add Snack
          </button>
        </div>
      </div>
    </div>
  );
}