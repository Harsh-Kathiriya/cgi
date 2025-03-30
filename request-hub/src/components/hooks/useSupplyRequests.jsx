import { useState, useEffect } from "react";
import { db, collection, getDocs, query, where } from "../../firebase/firebase"; // Import from your firebase.js file

const useSupplyRequests = () => {
  const [supplyRequests, setSupplyRequests] = useState([]);

  useEffect(() => {
    const fetchSupplyRequests = async () => {
      const q = query(
        collection(db, "requests"),
        where("type", "==", "supply"),
        where("status", "in", ["pending", "in-progress"])
      );
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSupplyRequests(requests);
    };

    fetchSupplyRequests();
  }, []);

  return supplyRequests;
};

export default useSupplyRequests;
