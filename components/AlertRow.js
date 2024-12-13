import React from "react";
import AlertIcon from "./AlertIcon";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CustomCheckbox from "./ui/CustomCheckbox";

const AlertRow = ({ alert, checked, onCheck }) => {
  const { t } = useTranslation();

  const handleCheckboxChange = () => {
    onCheck(alert.id);
  };

  return (
    <tr className="group border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 hover:backdrop-blur-lg hover:bg-opacity-60 hover:bg-gray-200 dark:hover:bg-gray-700">
      <td className="p-3">
        <CustomCheckbox checked={checked} onChange={handleCheckboxChange} />
      </td>
      <td className="p-3">
        <AlertIcon level={alert.severity} />
      </td>
      <td className="p-3">{alert.message}</td>
      <td className="p-3">{alert.component}</td>
      <td className="p-3">
        {format(new Date(alert.date), "dd/MM/yyyy HH:mm", {
          locale: es,
        })}
      </td>
      <td className="p-3">{alert.status}</td>
      <td className="p-3">{alert.category}</td>
      <td className="p-3">{alert.serialNumber}</td>
    </tr>
  );
};

export default AlertRow;
