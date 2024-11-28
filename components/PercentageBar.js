const PercentageBar = ({
  title,
  value1,
  value2,
  label1,
  label2,
  color1,
  color2,
}) => {
  const numericValue1 = Number(value1) || 0;
  const numericValue2 = Number(value2) || 0;

  const total = numericValue1 + numericValue2;
  const percentage1 =
    total > 0 ? ((numericValue1 / total) * 100).toFixed(1) : 0;
  const percentage2 =
    total > 0 ? ((numericValue2 / total) * 100).toFixed(1) : 0;

  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold mb-2">{title}</h3>
      <div className="flex items-center w-full h-4 bg-gray-200 rounded-md overflow-hidden">
        <div
          style={{ width: `${percentage1}%`, backgroundColor: color1 }}
          className="h-full"
        ></div>
        <div
          style={{ width: `${percentage2}%`, backgroundColor: color2 }}
          className="h-full"
        ></div>
      </div>
      <div className="flex justify-between text-xs mt-1">
        <span>
          {label1}: {numericValue1.toFixed(2)} kWh ({percentage1}%)
        </span>
        <span>
          {label2}: {numericValue2.toFixed(2)} kWh ({percentage2}%)
        </span>
      </div>
    </div>
  );
};

export default PercentageBar;
