import { useState, useEffect } from "react";

const useUserFilter = (users) => {
  const [filteredUsers, setFilteredUsers] = useState(users);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const filterUsers = (searchTerm) => {
    if (!searchTerm) {
      setFilteredUsers(users);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = users.filter((user) => {
      return (
        user.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
        user.email.toLowerCase().includes(lowerCaseSearchTerm)
      );
    });

    setFilteredUsers(filtered);
  };

  return { filteredUsers, filterUsers };
};

export default useUserFilter;
