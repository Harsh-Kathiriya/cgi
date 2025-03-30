import { useState } from "react";
import { db, collection, addDoc } from "../firebase/firebase";
import useSnacks from "../components/hooks/useSnacks";
import SnackCard from "../components/SnackCard";
import AddSnackDialog from "../components/AddSnackDialog";
import ParticlesBg from "../utils/ParticleBg";
import RestockDialog from "../components/RestockDialog";

export default function SnacksPage() {
  const { snacks, fetchSnacks } = useSnacks();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false);
  const [selectedSnack, setSelectedSnack] = useState(null);

  const handleOpenAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setIsAddDialogOpen(false);
  };

  const handleOpenRestockDialog = (snack) => {
    setSelectedSnack(snack);
    setIsRestockDialogOpen(true);
  };

  const handleCloseRestockDialog = () => {
    setIsRestockDialogOpen(false);
    setSelectedSnack(null);
  };

  const handleSnackAdded = () => {
    fetchSnacks();
  };

  const handleSnackUpdate = () => {
    fetchSnacks();
  };

  return (
    <div className="relative w-full h-screen flex justify-center items-center">
        <ParticlesBg />
    <div className="w-full max-w-4xl min-h-[500px] rounded-2xl shadow-2xl p-8 flex flex-col justify-evenly items-center transition-all text-white md:w-4/5 sm:w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Snacks</h2>
      <input
        type="text"
        placeholder="Search for a snack..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-4 bg-gray-800 text-white rounded-md w-full text-lg mb-6"
      />
      <div className="grid grid-cols-3 gap-6">
        {snacks
          .filter((snack) =>
            snack.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((snack) => (
            <SnackCard
              key={snack.id}
              snack={snack}
              onSnackUpdate={handleSnackUpdate}
              onRequestRestock={handleOpenRestockDialog}
            />
          ))}
        <div
          className="glass-container w-40 h-40 bg-gray-800 rounded-xl flex items-center justify-center text-lg font-bold cursor-pointer transition-all hover:scale-110 hover:shadow-xl"
          onClick={handleOpenAddDialog}
        >
          +
        </div>
      </div>
      {isAddDialogOpen && (
        <AddSnackDialog
          onClose={handleCloseAddDialog}
          snacks={snacks}
          onSnackAdded={handleSnackAdded}
        />
      )}
      {isRestockDialogOpen && (
        <RestockDialog onClose={handleCloseRestockDialog} />
      )}
    </div>
    </div>
  );
}