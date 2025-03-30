import { useState, useEffect } from "react";
import { db, collection, getDocs } from "../../firebase/firebase";

const useSnacks = () => {
  const [snacks, setSnacks] = useState([]);

  const fetchSnacks = async () => {
    const querySnapshot = await getDocs(collection(db, "snacks"));
    const snacksData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setSnacks(snacksData);
  };

  useEffect(() => {
    fetchSnacks();
  }, []);

  return { snacks, fetchSnacks };
};

export default useSnacks;