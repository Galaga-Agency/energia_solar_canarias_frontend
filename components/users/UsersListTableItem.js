import React from "react";

const UsersListTableItem = ({ user, onClick }) => {
  return (
    <tr onClick={() => onClick(user.id)}>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
    </tr>
  );
};

export default UsersListTableItem;
