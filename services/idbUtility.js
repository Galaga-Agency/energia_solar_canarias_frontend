import { openDB } from "idb";

// Initialize IndexedDB
export const initDB = async () => {
  return openDB("app-data", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("api-data")) {
        db.createObjectStore("api-data", { keyPath: "key" });
      }
    },
  });
};

// Save data to IndexedDB
export const saveToIndexedDB = async (key, data) => {
  const db = await initDB();
  await db.put("api-data", { key, data });
};

// Fetch data from IndexedDB
export const fetchFromIndexedDB = async (key) => {
  const db = await initDB();
  const result = await db.get("api-data", key);
  return result ? result.data : null;
};
