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
      <td className="w-8 p-3">
        <div className="flex justify-center items-center w-full">
          <CustomCheckbox checked={checked} onChange={handleCheckboxChange} />
        </div>
      </td>
      <td className="p-3">
        <div className="flex justify-center items-center w-full">
          <AlertIcon level={alert.severity} />
        </div>
      </td>
      <td className="p-3 text-left whitespace-normal w-auto leading-snug max-h-[5.5rem] overflow-hidden">
        {t(alert.message)}
      </td>

      <td className="p-3 text-center">{t(alert.component)}</td>
      <td className="p-3 text-center whitespace-nowrap">
        {format(new Date(alert.date), "dd/MM/yyyy HH:mm", { locale: es })}
      </td>
      <td className="p-3 text-center">{t(alert.status)}</td>
      <td className="p-3 text-center">{t(alert.category)}</td>
      <td className="p-3 text-center font-mono whitespace-nowrap">
        {alert.serialNumber}
      </td>
    </tr>
  );
};

export default AlertRow;
