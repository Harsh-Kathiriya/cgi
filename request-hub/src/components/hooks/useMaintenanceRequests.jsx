import { useState, useEffect } from "react";
import { db, collection, getDocs, query, where } from "../../firebase/firebase"; // Import from your firebase.js file

const useMaintenanceRequests = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);

  useEffect(() => {
    const fetchMaintenanceRequests = async () => {
      const q = query(
        collection(db, "requests"),
        where("type", "==", "maintenance"),
        where("status", "in", ["pending", "in-progress"])
      );
      const querySnapshot = await getDocs(q);
      const requests = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMaintenanceRequests(requests);
    };

    fetchMaintenanceRequests();
  }, []);

  return maintenanceRequests;
};

export default useMaintenanceRequests;