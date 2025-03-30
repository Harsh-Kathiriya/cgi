import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom"; // useNavigate instead of useHistory
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import SelectionBar from "../components/SelectionBar";
import InventoryItem from "../components/InventoryItem";
import ParticlesBg from "../utils/ParticleBg";
import CartItem from "../components/CartItem";
import RequestCard from "../components/RequestCard"; // Import the new component

const db = getFirestore();

export default function ManagerDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate(); // Hook for navigation
  const [selectedCategory, setSelectedCategory] = useState("snacks");
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);
  const [activeButton, setActiveButton] = useState("supply");
  const [requests, setRequests] = useState([]);

  
  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      try {
        const collectionName = selectedCategory === "snacks" ? "snacks" : "requests";
        const querySnapshot = await getDocs(collection(db, collectionName));
        let items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
        if (selectedCategory === "supply" || selectedCategory === "other") {
          // Filter items to include only those of type "supply" or "other"
          items = items.filter(item => item.type === selectedCategory);
        }
  
        setInventory(items);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchInventory();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cart"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCart(items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "requests"));
        const requests = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRequests(requests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/"); // use navigate() to redirect to the landing page after logout
  };

  const handleQuantityChange = async (index, newQuantity) => {
    const updatedInventory = [...inventory];
    updatedInventory[index].quantityInStock = newQuantity;
    setInventory(updatedInventory);

    // Update the quantity in the database
    const itemRef = doc(db, selectedCategory === "snacks" ? "snacks" : "requests", updatedInventory[index].id);
    try {
      await updateDoc(itemRef, { quantityInStock: newQuantity });
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const handleAddToCart = async (item, quantity) => {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    if (existingItem) {
      const itemRef = doc(db, "cart", existingItem.id);
      try {
        await updateDoc(itemRef, { quantity });
        setCart(cart.map(cartItem => cartItem.name === item.name ? { ...cartItem, quantity } : cartItem));
      } catch (error) {
        console.error("Error updating cart:", error);
      }
    } else {
      try {
        const docRef = await addDoc(collection(db, "cart"), {
          name: item.name,
          quantity
        });
        setCart([...cart, { id: docRef.id, name: item.name, quantity }]);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
    alert(`${quantity} ${item.name}(s) added to cart`);
  };

  const handleDeleteFromCart = async (id) => {
    try {
      await deleteDoc(doc(db, "cart", id));
      setCart(cart.filter(cartItem => cartItem.id !== id));
    } catch (error) {
      console.error("Error deleting from cart:", error);
    }
  };

  const handleButtonClick = (button) => {
    setActiveButton(button);
    if (button === "cart") {
      setShowCart(true);
    } else {
      setShowCart(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const updatedRequests = requests.map(request =>
      request.id === id ? { ...request, status: newStatus } : request
    );
    setRequests(updatedRequests);

    // Update the status in the database
    const requestRef = doc(db, "requests", id);
    try {
      await updateDoc(requestRef, { status: newStatus });
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  const maintenanceRequests = requests.filter(request => request.type === "maintenance");
  const suggestionRequests = requests.filter(request => request.type === "suggestion");

  return (
    <div className="h-screen flex flex-col items-center text-white">
      <ParticlesBg />
      <div className="fixed top-0 w-full p-4 flex justify-between items-center bg-gray-800 shadow-lg z-50">
        <div className="flex space-x-4">
          <button onClick={() => handleButtonClick("supply")} className={`px-6 py-4 rounded-lg text-xl bg-gray-800 hover:bg-gray-600 ${activeButton === "supply" ? "bg-gray-600" : ""}`}>
            Supply
          </button>
          <button onClick={() => handleButtonClick("maintenance")} className={`px-6 py-4 rounded-lg text-xl bg-gray-800 hover:bg-gray-600 ${activeButton === "maintenance" ? "bg-gray-600" : ""}`}>
            Maintenance
          </button>
          <button onClick={() => handleButtonClick("suggestion")} className={`px-6 py-4 rounded-lg text-xl bg-gray-800 hover:bg-gray-600 ${activeButton === "suggestion" ? "bg-gray-600" : ""}`}>
            Suggestion
          </button>
          <button onClick={() => handleButtonClick("cart")} className={`px-6 py-4 rounded-lg text-xl bg-gray-800 hover:bg-gray-600 ${activeButton === "cart" ? "bg-gray-600" : ""}`}>
            Cart
          </button>
        </div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg">
          Logout
        </button>
      </div>
  
      <div className="mt-20 w-full max-w-4xl p-8 flex flex-col justify-evenly items-center">
        {activeButton === "maintenance" ? (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Maintenance Requests</h2>
            <div className="grid grid-cols-1 gap-6">
              {maintenanceRequests.map((request, index) => (
                <div key={index} className="glass-container p-4 rounded-lg shadow-md relative">
                  <h3 className="text-2xl font-bold mb-2">{request.title}</h3>
                  <p className="text-sm text-gray-300 mb-4">{request.description}</p>
                  <p className="text-xs text-gray-400 absolute bottom-2 right-2">{new Date(request.timestamp.toDate()).toLocaleString()}</p>
                  <p className="text-xs text-gray-400 absolute top-2 right-2">{request.userName}</p>
                  <div className="flex justify-center mt-4">
                    <select
                      className="p-2 bg-gray-800 rounded-lg"
                      value={request.status}
                      onChange={(e) => handleStatusChange(request.id, e.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeButton === "suggestion" ? (
          <div className="w-full">
            <h2 className="text-2xl font-bold mb-4">Suggestion Requests</h2>
            <div className="grid grid-cols-1 gap-6">
              {suggestionRequests.map((request, index) => (
                <div key={index} className="glass-container p-4 rounded-lg shadow-md relative">
                  <h3 className="text-xl font-bold mb-2">By {request.userName}</h3>
                  <p className="text-sm text-gray-300 mb-4">{request.description}</p>
                  <p className="text-xs text-gray-400 absolute bottom-2 right-2">{new Date(request.timestamp.toDate()).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        ) : !showCart ? (
          <>
            <SelectionBar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
  
            {loading ? (
              <div>Loading...</div>
            ) : inventory.length === 0 ? (
              <div>No inventory found</div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {inventory.map((item, index) => (
                  <InventoryItem key={index} item={item} index={index} handleQuantityChange={handleQuantityChange} handleAddToCart={handleAddToCart} selectedCategory={selectedCategory} cart={cart} />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Cart Items</h2>
            <div className="grid grid-cols-3 gap-6">
              {cart.map((cartItem, index) => (
                <CartItem key={index} item={cartItem} handleDeleteFromCart={handleDeleteFromCart} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}