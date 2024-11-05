import { useState, useEffect } from "react";

const useUserSort = (users) => {
  const [sortedUsers, setSortedUsers] = useState(users);

  useEffect(() => {
    setSortedUsers(users);
  }, [users]);

  const sortUsers = (criteria) => {
    let sorted = [...users];
    switch (criteria) {
      case "alphabetical":
        sorted.sort((a, b) => {
          const nameA = a.nombre || "";
          const nameB = b.nombre || "";
          return nameA.localeCompare(nameB);
        });
        break;
      case "registrationDate":
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        sorted = users;
    }
    setSortedUsers(sorted);
  };

  return { sortedUsers, sortUsers };
};

export default useUserSort;
