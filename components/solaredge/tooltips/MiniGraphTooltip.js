const MiniGraphTooltip = ({ active, payload, selectedRange }) => {
  if (!active || !payload || !payload.length) return null;

  // Find the first payload entry with a valid time
  const dataPayload = payload.find((p) => p.payload?.time);
  if (!dataPayload) return null;

  const timestamp = dataPayload.payload.time;
  const date = new Date(timestamp);
  if (isNaN(date)) return null;

  const padNumber = (num) => String(num).padStart(2, "0");

  let formattedTime;

  // Handle "yesterday" range specifically
  if (selectedRange === "YESTERDAY") {
    formattedTime = `${padNumber(date.getHours())}:${padNumber(
      date.getMinutes()
    )}`;
  } else {
    switch (selectedRange?.toLowerCase()) {
      case "week":
      case "month":
        formattedTime = `${padNumber(date.getDate())}/${padNumber(
          date.getMonth() + 1
        )}`;
        break;
      case "year":
        formattedTime = date
          .toLocaleDateString("es-ES", { month: "short" })
          .toUpperCase();
        break;
      default:
        formattedTime = `${padNumber(date.getDate())}/${padNumber(
          date.getMonth() + 1
        )}`;
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-600 dark:text-gray-300">
        <span className="font-bold">{formattedTime}</span>:{" "}
        {dataPayload.value.toFixed(2)} kWh
      </p>
    </div>
  );
};

export default MiniGraphTooltip;
