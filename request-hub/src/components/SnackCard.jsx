import { useState } from "react";
import { db, doc, updateDoc } from "../firebase/firebase";

export default function SnackCard({ snack, onSnackUpdate, onRequestRestock }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const handleSelectSnack = async () => {
    const snackRef = doc(db, "snacks", snack.id);
    const newNumberOfPeopleWant = isSelected
      ? snack.numberOfPeopleWant - 1
      : snack.numberOfPeopleWant + 1;

    await updateDoc(snackRef, {
      numberOfPeopleWant: newNumberOfPeopleWant,
    });

    setIsSelected(!isSelected);
    onSnackUpdate();
  };

  const handleRequestRestock = () => {
    onRequestRestock(snack);
  };

  return (
    <div
      className={`glass-container w-40 h-40 bg-gray-800 rounded-xl flex items-center justify-center text-lg font-bold cursor-pointer transition-all hover:scale-110 hover:shadow-xl ${
        isFlipped ? "flipped" : ""
      } ${isSelected ? "glass-container-selected scale-110" : ""}`}
      onClick={handleSelectSnack}
      onDoubleClick={handleRequestRestock}
    >
      {isFlipped ? (
        <button
          className="glass-container-selected w-30 px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all"
        >
          Request Restock
        </button>
      ) : (
        snack.name
      )}
    </div>
  );
}