import { db, collection, query, where, getDocs, addDoc, serverTimestamp } from "./firebase";

// Collection references
export const requestsCollection = collection(db, "requests");
export const suppliesCollection = collection(db, "supplies");

// Supply-related functions
export const getSuppliesByType = async (type) => {
  try {
    const q = query(suppliesCollection, where("type", "==", type));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching supplies:", error);
    return [];
  }
};

export const addSupply = async (supplyData) => {
  try {
    const newSupply = {
      ...supplyData,
      currentStock: supplyData.currentStock || 1,
      lowStockThreshold: supplyData.lowStockThreshold || 3,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(suppliesCollection, newSupply);
    return { id: docRef.id, ...newSupply };
  } catch (error) {
    console.error("Error adding supply:", error);
    throw error;
  }
};

export const updateSupplyStock = async (supplyId, newStock) => {
  try {
    const supplyRef = doc(db, "supplies", supplyId);
    await updateDoc(supplyRef, { 
      currentStock: newStock,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating supply stock:", error);
    throw error;
  }
};

// Request-related functions
export const addRequest = async (requestData) => {
  try {
    const docRef = await addDoc(requestsCollection, {
      ...requestData,
      timestamp: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding request:", error);
    throw error;
  }
};